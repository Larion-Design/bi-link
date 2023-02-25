import { gql, useLazyQuery } from '@apollo/client'

import {
  CompanyListRecord,
  EventListRecord,
  LocationAPIOutput,
  PersonListRecordWithImage,
  PropertyListRecord,
} from 'defs'

type Response = {
  getPersonsInfo: PersonListRecordWithImage[]
  getCompanies: CompanyListRecord[]
  getProperties: PropertyListRecord[]
  getIncidents: EventListRecord[]
  getLocations: LocationAPIOutput[]
}

type Params = {
  personsIds: string[]
  companiesIds: string[]
  propertiesIds: string[]
  eventsIds: string[]
  locationsIds: string[]
}

const request = gql`
  query GetEntitiesInfo(
    $personsIds: [String!]!
    $companiesIds: [String!]!
    $propertiesIds: [String!]!
    $eventsIds: [String!]!
    $locationsIds: [String!]!
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
      type
    }
    getLocations(locationsIds: $locationsIds) {
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
    }
  }
`

export const getEntitiesInfoRequest = () => useLazyQuery<Response, Params>(request)
