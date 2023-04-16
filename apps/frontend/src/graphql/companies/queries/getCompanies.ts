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
    }
  }
`

export const getCompaniesInfoRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
