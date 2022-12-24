import { gql, useLazyQuery } from '@apollo/client'
import { IncidentsSuggestions } from 'defs'

type Params = {
  searchTerm: string
  limit: number
  skip: number
}

type Response = {
  searchIncidents: IncidentsSuggestions
}

const request = gql`
  query SearchIncidents($searchTerm: String!, $limit: Int! = 20, $skip: Int! = 0) {
    searchIncidents(searchTerm: $searchTerm, skip: $skip, limit: $limit) {
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

export const searchIncidentsRequest = () =>
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-and-network' })
