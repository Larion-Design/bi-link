import { gql, useLazyQuery } from '@apollo/client'
import { EventAPIOutput } from 'defs'

type Params = {
  eventsIds: string[]
}

type Response = {
  getEvents: EventAPIOutput[]
}

const request = gql`
  query GetEventsInfo($eventsIds: [String!]!) {
    getEvents(eventsIds: $eventsIds) {
      _id
      date
      type
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

export const getEventsInfoRequest = () =>
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-and-network' })
