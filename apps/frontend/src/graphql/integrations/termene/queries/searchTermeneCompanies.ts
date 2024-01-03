import { gql, useLazyQuery } from '@apollo/client'
import { OSINTCompany } from 'defs'

type Params = {
  searchTerm: string
}

type Response = {
  searchTermeneCompanies: OSINTCompany[]
}

const request = gql`
  query SearchTermeneCompanies($searchTerm: String!) {
    searchTermeneCompanies(searchTerm: $searchTerm) {
      cui
      name
      registrationNumber
      headquarters
    }
  }
`

export const searchTermeneCompanies = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
