import { gql, useLazyQuery } from '@apollo/client'
import { SearchParams } from '@frontend/graphql/shared/types/searchParams'
import { PersonListRecord, PersonsSuggestions } from 'defs'

type Response = {
  searchPersons: PersonsSuggestions<PersonListRecord>
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
  useLazyQuery<Response, SearchParams>(SearchPersons, {
    fetchPolicy: 'cache-and-network',
  })
