export const CREATE_TCP_PROXY = `
mutation TcpProxyCreate($input:TCPProxyCreateInput!) {
    tcpProxyCreate(input: $input) {
        applicationPort
        createdAt
        deletedAt
        domain
        environmentId
        id
        proxyPort
        serviceId
        updatedAt
    }
}
`
