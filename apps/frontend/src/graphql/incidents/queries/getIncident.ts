import { gql, useLazyQuery } from '@apollo/client'
import { IncidentAPIInput } from 'defs'

type Params = {
  incidentId: string
}

type Response = {
  getIncident: IncidentAPIInput
}

const request = gql`
  query GetIncident($incidentId: String!) {
    getIncident(incidentId: $incidentId) {
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

export const getIncidentRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
