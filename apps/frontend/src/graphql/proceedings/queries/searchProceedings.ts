import { gql, useLazyQuery } from '@apollo/client'
import { SearchParams } from '@frontend/graphql/shared/types/searchParams'
import { ProceedingSuggestions } from 'defs'

type Response = {
  searchProceedings: ProceedingSuggestions
}

const request = gql`
  query SearchProceedings($searchTerm: String!, $limit: Int, $skip: Int) {
    searchProceedings(searchTerm: $searchTerm, limit: $limit, skip: $skip) {
      _id
      name
      type
      fileNumber
      year
    }
  }
`

export const searchProceedingsRequest = () =>
  useLazyQuery<Response, SearchParams>(request, {
    fetchPolicy: 'cache-first',
  })
