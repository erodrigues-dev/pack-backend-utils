import { getNamespace } from "cls-hooked"

export const setExternalLogs = ({ externalLog, externalName }) => {
    const namespace = getNamespace('scoped-request')
    
    const externalLogs = namespace?.get('externalLogs')
    externalLogs.push({ externalLog, externalName })

    namespace.set('externalLogs', externalLogs)
}