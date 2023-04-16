import { gql, useLazyQuery } from '@apollo/client'
import { EventAPIOutput } from 'defs'

type Params = {
  eventsIds: string[]
}

type Response = {
  getEvents: EventAPIOutput[]
}

const request = gql`
  query GetEventsInfo($eventsIds: [ID!]!) {
    getEvents(eventsIds: $eventsIds) {
      _id
      date {
        value
      }
      type {
        value
      }
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
        type
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
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-first' })
