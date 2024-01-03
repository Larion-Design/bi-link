import { gql, useLazyQuery } from '@apollo/client'
import { SearchParams } from '@frontend/graphql/shared/types/searchParams'
import { EventsSuggestions } from 'defs'

type Response = {
  searchEvents: EventsSuggestions
}

const request = gql`
  query SearchEvents($searchTerm: String!, $limit: Int! = 20, $skip: Int! = 0) {
    searchEvents(searchTerm: $searchTerm, skip: $skip, limit: $limit) {
      total
      records {
        _id
        date
        type
        location
      }
    }
  }
`

export const searchEventsRequest = () =>
  useLazyQuery<Response, SearchParams>(request, { fetchPolicy: 'cache-first' })
