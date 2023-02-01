import { gql, useLazyQuery } from '@apollo/client'
import { IncidentAPIOutput } from 'defs'

type Params = {
  incidentsIds: string[]
}

type Response = {
  getIncidents: IncidentAPIOutput[]
}

const request = gql`
  query GetIncidentsInfo($incidentsIds: [String!]!) {
    getIncidents(incidentsIds: $incidentsIds) {
      _id
      date
      type
      location
      description
      customFields {
        fieldName
        fieldValue
      }
      parties {
        name
        description
        customFields {
          fieldName
          fieldValue
        }
        persons {
          _id
        }
        properties {
          _id
        }
        companies {
          _id
        }
        _confirmed
      }
      files {
        fileId
        name
        description
        isHidden
      }
    }
  }
`

export const getIncidentsInfoRequest = () =>
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-and-network' })