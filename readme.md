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
- logRequest: executa o log do request
- setApplicationVersion: insere no response um header com a versão da aplicação
- logResponse: executa o log do response
- errorHandler: captura e trata os erros da aplicação


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

### Log Request

**Settings:**

- **ignore:** o middleware irá ignorar totalmente o log para essas rotas

```yaml
log:
  requestResponse:
    ignore:
      - /api/v1/sample/ignored-route

# config.yaml
```

### Log Response

**Settings:**

- **ignore:** o middleware irá ignorar totalmente o log para essas rotas
- **ignoreBody:** o middleware vai ignorar o log do body para essas rotas


```yaml
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

### NotFoundError

Define um erro para objeto não encontrado, extende `ClientError`

- name: NotFoundError
- status: 404