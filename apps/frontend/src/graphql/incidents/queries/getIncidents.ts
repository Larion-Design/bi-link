import { gql, useLazyQuery } from '@apollo/client'
import { IncidentListRecord } from '../../../types/incident'

type Params = {
  incidentsIds: string[]
}

type Response = {
  getIncidents: IncidentListRecord[]
}

const request = gql`
  query GetIncidents($incidentsIds: [String!]!) {
    getIncidents(incidentsIds: $incidentsIds) {
      _id
      date
      location
    }
  }
`

export const getIncidentsRequest = () =>
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-first' })
