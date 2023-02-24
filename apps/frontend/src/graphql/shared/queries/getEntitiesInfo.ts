import { gql, useLazyQuery } from '@apollo/client'

import {
  CompanyListRecord,
  EventListRecord,
  PersonListRecordWithImage,
  PropertyListRecord,
} from 'defs'

type Response = {
  getPersonsInfo: PersonListRecordWithImage[]
  getCompanies: CompanyListRecord[]
  getProperties: PropertyListRecord[]
  getIncidents: EventListRecord[]
}

type Params = {
  personsIds: string[]
  companiesIds: string[]
  propertiesIds: string[]
  eventsIds: string[]
}

const request = gql`
  query GetEntitiesInfo(
    $personsIds: [String!]!
    $companiesIds: [String!]!
    $propertiesIds: [String!]!
    $eventsIds: [String!]!
  ) {
    getPersonsInfo(personsIds: $personsIds) {
      _id
      firstName
      lastName
      images {
        url {
          url
        }
      }
    }
    getCompanies(companiesIds: $companiesIds) {
      _id
      name
      cui
      registrationNumber
    }
    getProperties(propertiesIds: $propertiesIds) {
      _id
      name
      type
    }
    getEvents(eventsIds: $eventsIds) {
      _id
      date
      location {
        locationId
        street
        number
        building
        door
        zipCode
        locality
        county
        country
        otherInfo
        coordinates {
          lat
          long
        }
      }
    }
  }
`

export const getEntitiesInfoRequest = () => useLazyQuery<Response, Params>(request)
