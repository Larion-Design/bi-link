import { gql, useQuery } from '@apollo/client'

type Response = {
  getEventFrequentCustomFields: string[]
}

const query = gql`
  query GetEventFrequentCustomFields {
    getEventFrequentCustomFields
  }
`

export const getEventFrequentCustomFieldsRequest = () =>
  useQuery<Response>(query, { fetchPolicy: 'cache-first' })
