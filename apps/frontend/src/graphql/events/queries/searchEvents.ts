import { gql, useLazyQuery } from '@apollo/client'
import { EventsSuggestions } from 'defs'

type Params = {
  searchTerm: string
  limit: number
  skip: number
}

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
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-and-network' })
