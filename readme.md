# Readme

Este pack exporta alguns utilitários e middlewares para projetos de web api que
utilizam express e simple-node-framework (não existe dependencia direta)

## Middlewares

Existem 2 hooks exportados neste modulo `pack-backend-utils/middlewares/hooks.js`

- useBeforeRoutes: deve ser executado antes das importações de rotas
- useAfterRoutes: deve ser executado após as inmportações de rotas

Esses hooks irão configurar os seguintes middlewares:

- setLogger: insere no request um instancia do logger utilizado pela aplicação, nesse exemplo abaixo estamos utilizando o logger do simple-node-framework
- setRequestId: insere o requestId no request
- setAuthorization: faz o parse das informações de autorização
- setApplicationVersion: insere no response um header com a versão da aplicação
- setContentBody: armazena o body num atributo contentBody que será utilizado pelo logResponse
- logRequest: executa o log do request
- errorHandler: captura e trata os erros da aplicação
- logResponse: executa o log do response


Ex:
```javascript

import express from 'express'
import snf from 'simple-node-framework'
import { useBeforeRoutes, useAfterRoutes } from 'pack-backend-utils/middlewares/hooks.js'

import sampleRouter from './api/modules/sample/router'


const app = express()
const { config, log } = snf.Singleton

// call before import routers
useBeforeRoutes(app, config, log)

// import routes here
app.use(sampleRouter)

// call after import routers
useAfterRoutes(app, config)

```

## Middleware Settings

**Settings:**

- **errorHandler.ignoreDetail:** não adiciona os detalhes internos do erro no response
- **log.requestResponse.ignore:** ignora log de request/response para as rotas configuradas
- **log.requestResponse.ignoreBody:** não adiciona o body no log de response

```yaml
errorHandler:
  ignoreDetail: true
log:
  requestResponse:
    ignore:
      - /api/v1/sample/ignored-route
    ignoreBody:
      - /api/v1/sample/ignored-body

# config.yaml
```


## Custom Errors

- ApplicationError
- ClientError
- NotFoundError

### ApplicationError

Define um erro de aplicação na faixa de 5xx, define alguns padrões

- name: ApplicationError
- isCustomError: true
- message: Sorry, an unexpected error occurred
- status: 500
- code: APPLICATION_ERROR

### ClientError

Define um erro gerado pelo usuário extende `ApplicationError`, geralmente um erro de validação na faixa de 4xx

- name: ClientError
- status: 400
- code: CLIENT_ERROR
- message: Invalid request, check the data and try again

### NotFoundError

Define um erro para objeto não encontrado, extende `ClientError`

- name: NotFoundError
- status: 404
- message: This resource is not found

## Utils

Divididos em dois grupos errors e request, são utilizados internamente pelos os middlewares

### Errors

- **getDetailFromError:** monta um objeto detalhado sobre um erro, especialmente para erros do Axios

```javascript
// AxiosError
{
  name: 'AxiosError',
  origin: 'https://example.com',
  endpoint: '[POST] /api/v1/sample',
  message: 'ORA-08103 Object no longer exists',
  status: 500,
  response: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'ORA-08103 Object no longer exists'
  }
}
// Error
{
  name: 'Error',
  stack: 'Error stack...',
  message: 'cannot access id from undefined object'
}
```

- **isServerTimeout:** verifica se o erro foi um erro 502/504

### Request

- **getRequestId:** recupera o request id ou cria, ele tenta recuperar o requestId apartir dos headers x-request-id, request-id ou request_id caso não seja informado ele cria um id e atribui a req.id
- **getRequestIp:**: recupera o ip do cliente através do request
- **getTraceFields:** recupera algumas informações de trace apartir do request
```javascript
{
  requestId: '8f9e5100-bc19-423c-824e-b7ae77146bf6',
  requestPath: '/api/v1/sample'
  sessionId: 'db3dff03-5df5-437b-8bcb-e7bb113bfaaa'
  origin: {
    ip: '127.0.0.1',
    application: 'application name',
    channel: 'application channel name',
    user: 'username',
    referrer: 'origin of request'
  }
}
```