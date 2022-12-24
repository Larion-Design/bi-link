import { gql, useLazyQuery } from '@apollo/client'
import { PersonListRecord, PersonsSuggestions } from 'defs'

type Response = {
  searchPersons: PersonsSuggestions<PersonListRecord>
}

type Params = {
  searchTerm: string
  limit: number
  skip: number
}

const SearchPersons = gql`
  query SearchPerson($searchTerm: String!, $limit: Int! = 20, $skip: Int! = 0) {
    searchPersons(searchTerm: $searchTerm, skip: $skip, limit: $limit) {
      total
      records {
        _id
        firstName
        lastName
        cnp
      }
    }
  }
`

export const searchPersonsRequest = () =>
  useLazyQuery<Response, Params>(SearchPersons, {
    fetchPolicy: 'cache-and-network',
  })
