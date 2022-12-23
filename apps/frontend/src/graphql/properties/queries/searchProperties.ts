import { gql, useLazyQuery } from '@apollo/client'
import { PropertiesSuggestions } from '../../../types/property'

type Params = {
  searchTerm: string
  limit: number
  skip: number
}

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
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-and-network' })
