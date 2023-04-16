import { gql, useLazyQuery } from '@apollo/client'
import { PropertyListRecord } from 'defs'

type Params = {
  personId: string
}

type Response = {
  getPropertiesByPerson: PropertyListRecord[]
}

const request = gql`
  query GetPropertiesByPerson($personId: ID!) {
    getPropertiesByPerson(personId: $personId) {
      _id
      name
      type
    }
  }
`

export const getPropertiesByPersonRequest = () =>
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-first' })
