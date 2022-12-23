import { gql, useQuery } from '@apollo/client'

type Response = {
  getIncidentFrequentCustomFields: string[]
}

const query = gql`
  query GetIncidentFrequentCustomFields {
    getIncidentFrequentCustomFields
  }
`

export const getIncidentFrequentCustomFieldsRequest = () =>
  useQuery<Response>(query, { fetchPolicy: 'cache-first' })
