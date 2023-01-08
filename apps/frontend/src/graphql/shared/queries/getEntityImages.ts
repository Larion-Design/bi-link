import { gql, useQuery } from '@apollo/client'
import { EntityType, FileAPIOutput } from 'defs'

type Response = {
  getEntityImages: FileAPIOutput[]
}

type Params = {
  entityId: string
  entityType: EntityType
}

const request = gql`
  query GetEntityImages($entityId: String!, $entityType: String!) {
    getEntityImages(entityId: $entityId, entityType: $entityType) {
      fileId
      url {
        url
      }
    }
  }
`

export const getEntityImages = (entityId: string, entityType: EntityType) =>
  useQuery<Response, Params>(request, {
    variables: { entityId, entityType },
    fetchPolicy: 'cache-and-network',
  })
