import { gql, useMutation } from '@apollo/client'
import { ProceedingAPIInput, ProceedingAPIOutput } from 'defs'

type Params = {
  data: ProceedingAPIInput
}

type Response = {
  createProceeding: ProceedingAPIOutput['_id']
}

const request = gql`
  mutation CreateEvent($data: EventInput!) {
    createEvent(data: $data)
  }
`

export const createProceedingRequest = () => useMutation<Response, Params>(request)
