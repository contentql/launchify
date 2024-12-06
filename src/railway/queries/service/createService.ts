export const CREATE_SERVICE = `
    mutation ServiceCreate($input: ServiceCreateInput!) {
        serviceCreate(input: $input) {
            id
            name
            icon
            projectId
            createdAt
            deletedAt
            updatedAt
        }
    }
`
