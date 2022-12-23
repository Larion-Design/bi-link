import { gql, useQuery } from '@apollo/client'

type Response = {
  getCompanyFrequentCustomFields: string[]
}

const query = gql`
  query GetCompanyFrequentCustomFields {
    getCompanyFrequentCustomFields
  }
`

export const getCompanyFrequentCustomFieldsRequest = () =>
  useQuery<Response>(query, { fetchPolicy: 'cache-first' })
