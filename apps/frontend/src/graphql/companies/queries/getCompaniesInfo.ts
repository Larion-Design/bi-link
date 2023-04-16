import { gql, useLazyQuery } from '@apollo/client'
import { CompanyAPIOutput } from 'defs'

type Params = {
  companiesIds: string[]
}

type Response = {
  getCompanies: CompanyAPIOutput[]
}

const request = gql`
  query GetCompanies($companiesIds: [ID!]!) {
    getCompanies(companiesIds: $companiesIds) {
      _id
      name {
        value
      }
      cui {
        value
      }
      registrationNumber {
        value
      }
      headquarters {
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
      locations {
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
      associates {
        person {
          _id
        }
        company {
          _id
        }
        role {
          value
        }
        startDate {
          value
        }
        endDate {
          value
        }
        isActive {
          value
        }
        equity {
          value
        }
        customFields {
          fieldName
          fieldValue
        }
      }
      contactDetails {
        fieldName
        fieldValue
      }
      customFields {
        fieldName
        fieldValue
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

export const getCompaniesRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
