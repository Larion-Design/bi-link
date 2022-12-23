import { gql, useLazyQuery } from '@apollo/client'
import { SearchParams } from '../../shared/types/searchParams'
import { CompaniesSuggestions } from '../../../types/company'

type Response = {
  searchCompanies: CompaniesSuggestions
}

const request = gql`
  query SearchCompanies(
    $searchTerm: String!
    $limit: Int! = 20
    $skip: Int! = 0
  ) {
    searchCompanies(searchTerm: $searchTerm, skip: $skip, limit: $limit) {
      total
      records {
        _id
        name
        cui
        registrationNumber
      }
    }
  }
`

export const searchCompaniesRequest = () =>
  useLazyQuery<Response, SearchParams>(request, {
    fetchPolicy: 'cache-and-network',
  })
