import { gql, useLazyQuery } from '@apollo/client'
import { CompanyListRecord } from 'defs'

type Params = {
  companiesIds: string[]
}

type Response = {
  getCompanies: CompanyListRecord[]
}

const request = gql`
  query GetCompanies($companiesIds: [String!]!) {
    getCompanies(companiesIds: $companiesIds) {
      _id
      name
      cui
      registrationNumber
    }
  }
`

export const getCompaniesInfoRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
