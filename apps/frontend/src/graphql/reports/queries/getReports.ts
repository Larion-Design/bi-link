import { gql, useQuery } from '@apollo/client'
import { EntityType, ReportAPIOutput } from 'defs'

type Params = {
  entityId: string
  entityType: EntityType
}

type Response = {
  getReports: ReportAPIOutput[]
}

const request = gql`
  query GetReports($entityId: ID!, $entityType: String!) {
    getReports(entityId: $entityId, entityType: $entityType) {
      _id
      name
      type
      updatedAt
    }
  }
`

export const getReportsRequest = (entityId: string, entityType: EntityType) =>
  useQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
    variables: {
      entityId,
      entityType,
    },
  })
