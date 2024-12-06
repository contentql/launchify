export const SERVICE_INSTANCE_UPDATE = `
mutation ServiceInstanceUpdate($environmentId: String!, $serviceId: String!,$input:ServiceInstanceUpdateInput!
) {
    serviceInstanceUpdate(
        environmentId: $environmentId
        input:$input
        serviceId: $serviceId
    )
}
`
