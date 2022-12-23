import { gql, useQuery } from '@apollo/client'

type Response = {
  getVehicleFrequentCustomFields: string[]
}

const query = gql`
  query GetVehicleFrequentCustomFields {
    getVehicleFrequentCustomFields
  }
`

export const getVehicleFrequentCustomFieldsRequest = () =>
  useQuery<Response>(query, { fetchPolicy: 'cache-first' })
