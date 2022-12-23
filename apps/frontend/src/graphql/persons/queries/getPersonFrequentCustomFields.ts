import { gql, useQuery } from '@apollo/client'

type Response = {
  getPersonFrequentCustomFields: string[]
}

const query = gql`
  query GetPersonFrequentCustomFields {
    getPersonFrequentCustomFields
  }
`

export const getPersonFrequentCustomFieldsRequest = () =>
  useQuery<Response>(query, { fetchPolicy: 'cache-first' })
