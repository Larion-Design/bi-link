import { gql, useMutation } from '@apollo/client'
import { EventAPIInput } from 'defs'

type Params = {
  data: EventAPIInput
}

type Response = {
  updateEvent: boolean
}

const request = gql`
  mutation UpdateEvent($eventId: String!, $data: EventInput!) {
    updateEvent(eventId: $eventId, data: $data)
  }
`

export const updateEventRequest = () => useMutation<Response, Params>(request)
