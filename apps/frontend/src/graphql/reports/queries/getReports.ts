import { gql, useQuery } from '@apollo/client'
import { ReportAPIOutput } from 'defs'

type EntityType = 'PERSON' | 'COMPANY' | 'PROPERTY' | 'INCIDENT'

type Params = {
  entityId: string
  entityType: EntityType
}

type Response = {
  getReports: ReportAPIOutput[]
}

const request = gql`
  query GetReports($entityId: String!, $entityType: String!) {
    getReports(entityId: $entityId, entityType: $entityType) {
      _id
      name
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
