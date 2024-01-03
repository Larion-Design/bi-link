import { gql, useLazyQuery } from '@apollo/client'
import { EventAPIInput } from 'defs'

type Params = {
  eventId: string
}

type Response = {
  getEvent: EventAPIInput
}

const request = gql`
  query GetEvent($eventId: ID!) {
    getEvent(eventId: $eventId) {
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

export const getEventRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
