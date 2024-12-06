export const CREATE_SERVICE_DOMAIN = `
    mutation ServiceDomainCreate($input: ServiceDomainCreateInput!) {
    serviceDomainCreate(input: $input) {
        id
        domain
        environmentId
        serviceId
        suffix
        createdAt
        updatedAt
    }
}

`
