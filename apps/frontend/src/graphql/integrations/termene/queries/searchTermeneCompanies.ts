import { gql, useLazyQuery } from '@apollo/client'
import { OSINTCompany } from 'defs'

type Params = {
  name?: string
  cui?: string
}

type Response = {
  searchTermeneCompanies: OSINTCompany[]
}

const request = gql`
  query SearchTermeneCompanies($cui: String, $name: String) {
    searchTermeneCompanies(cui: $cui, name: $name) {
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
