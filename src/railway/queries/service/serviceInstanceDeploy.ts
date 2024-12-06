export const SERVICE_INSTANCE_DEPLOY = `
mutation ServiceInstanceDeploy($environmentId: String!, $serviceId: String!) {
    serviceInstanceDeploy(
        environmentId: $environmentId
        serviceId: $serviceId
        commitSha: null
    )
}
`
