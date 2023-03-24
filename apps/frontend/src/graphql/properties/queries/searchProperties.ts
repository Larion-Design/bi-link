import { gql, useLazyQuery } from '@apollo/client'
import { SearchParams } from '@frontend/graphql/shared/types/searchParams'
import { PropertiesSuggestions } from 'defs'

type Response = {
  searchProperties: PropertiesSuggestions
}

const request = gql`
  query SearchProperties($searchTerm: String!, $limit: Int! = 20, $skip: Int! = 0) {
    searchProperties(searchTerm: $searchTerm, skip: $skip, limit: $limit) {
      total
      records {
        _id
        name
        type
      }
    }
  }
`

export const searchPropertiesRequest = () =>
  useLazyQuery<Response, SearchParams>(request, { fetchPolicy: 'cache-first' })
