import { gql, useLazyQuery } from '@apollo/client'
import { EventListRecord } from 'defs'

type Params = {
  eventsIds: string[]
}

type Response = {
  getEvents: EventListRecord[]
}

const request = gql`
  query GetEvents($eventsIds: [String!]!) {
    getEvents(eventsIds: $eventsIds) {
      _id
      date
      location {
        locationId
        street
        number
        building
        door
        locality
        county
        country
        zipCode
        otherInfo
        coordinates {
          lat
          long
        }
      }
    }
  }
`

export const getEventsRequest = () =>
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-first' })
