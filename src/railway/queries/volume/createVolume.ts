export const CREATE_VOLUME = `
mutation VolumeCreate($input:VolumeCreateInput!) {
    volumeCreate(input:$input ) {
        createdAt
        id
        name
        projectId
        createdAt
        name
    }
}

`
