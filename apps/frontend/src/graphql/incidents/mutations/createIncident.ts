import { gql, useMutation } from '@apollo/client'
import { IncidentAPIInput, IncidentAPIOutput } from '../../../types/incident'

type Params = {
  data: IncidentAPIInput
}

type Response = {
  createIncident: IncidentAPIOutput['_id']
}

const request = gql`
  mutation CreateIncident($data: IncidentInput!) {
    createIncident(data: $data)
  }
`

export const createIncidentRequest = () =>
  useMutation<Response, Params>(request)
