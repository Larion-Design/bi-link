import { gql, useLazyQuery } from '@apollo/client'
import { EventAPIInput } from 'defs'

type Params = {
  eventId: string
}

type Response = {
  getEvent: EventAPIInput
}

const request = gql`
  query GetEvent($eventId: String!) {
    getEvent(eventId: $eventId) {
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

export const getEventRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
