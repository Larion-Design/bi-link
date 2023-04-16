import { gql, useLazyQuery } from '@apollo/client'
import { EntityType, FileAPIOutput } from 'defs'

type Response = {
  getEntityImages: FileAPIOutput[]
}

type Params = {
  entityId: string
  entityType: EntityType
}

const request = gql`
  query GetFilesInfo($filesIds: [String!]!) {
    getFilesInfo(filesIds: $filesIds) {
      fileId
      name
      description
      isHidden
      mimeType
      url {
        url
      }
    }
  }
`

export const getFilesInfo = (entityId: string, entityType: EntityType) =>
  useLazyQuery<Response, Params>(request, {
    variables: { entityId, entityType },
    fetchPolicy: 'cache-first',
  })
