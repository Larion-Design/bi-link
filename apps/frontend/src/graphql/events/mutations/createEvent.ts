import { gql, useMutation } from '@apollo/client'
import { EventAPIInput, EventAPIOutput } from 'defs'

type Params = {
  data: EventAPIInput
}

type Response = {
  createEvent: EventAPIOutput['_id']
}

const request = gql`
  mutation CreateEvent($data: EventInput!) {
    createEvent(data: $data)
  }
`

export const createEventRequest = () => useMutation<Response, Params>(request)
