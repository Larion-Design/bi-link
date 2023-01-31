import { gql, useLazyQuery } from '@apollo/client'
import { CompanyAPIOutput } from 'defs'

type Params = {
  companiesIds: string[]
}

type Response = {
  getCompanies: CompanyAPIOutput[]
}

const request = gql`
  query GetCompanies($companiesIds: [String!]!) {
    getCompanies(companiesIds: $companiesIds) {
      _id
      name
      cui
      registrationNumber
      headquarters
      locations {
        address
        isActive
      }
      associates {
        person {
          _id
        }
        company {
          _id
        }
        role
        startDate
        endDate
        isActive
        equity
        customFields {
          _id
          fieldName
          fieldValue
        }
        _confirmed
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
    fetchPolicy: 'cache-and-network',
  })
