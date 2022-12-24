import { gql, useMutation } from '@apollo/client'
import { IncidentAPIInput } from 'defs'

type Params = {
  data: IncidentAPIInput
}

type Response = {
  updateIncident: boolean
}

const request = gql`
  mutation UpdateIncident($incidentId: String!, $data: IncidentInput!) {
    updateIncident(incidentId: $incidentId, data: $data)
  }
`

export const updateIncidentRequest = () => useMutation<Response, Params>(request)
