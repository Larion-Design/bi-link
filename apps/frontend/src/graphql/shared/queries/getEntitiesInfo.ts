import { gql, useLazyQuery } from '@apollo/client'

import { PersonListRecordWithImage } from '../../../types/person'
import { CompanyListRecord } from '../../../types/company'
import { IncidentListRecord } from '../../../types/incident'
import { PropertyListRecord } from '../../../types/property'

type Response = {
  getPersonsInfo: PersonListRecordWithImage[]
  getCompanies: CompanyListRecord[]
  getProperties: PropertyListRecord[]
  getIncidents: IncidentListRecord[]
}

type Params = {
  personsIds: string[]
  companiesIds: string[]
  propertiesIds: string[]
  incidentsIds: string[]
}

const request = gql`
  query GetEntitiesInfo(
    $personsIds: [String!]!
    $companiesIds: [String!]!
    $propertiesIds: [String!]!
    $incidentsIds: [String!]!
  ) {
    getPersonsInfo(personsIds: $personsIds) {
      _id
      firstName
      lastName
      image {
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
    getIncidents(incidentsIds: $incidentsIds) {
      _id
      date
      location
    }
  }
`

export const getEntitiesInfoRequest = () => useLazyQuery<Response, Params>(request)
