import { gql, useLazyQuery } from '@apollo/client'
import { PropertyListRecord } from 'defs'

type Params = {
  propertiesIds: string[]
}

type Response = {
  getProperties: PropertyListRecord[]
}

const request = gql`
  query GetProperties($propertiesIds: [String!]!) {
    getProperties(propertiesIds: $propertiesIds) {
      _id
      name
      type
    }
  }
`

export const getPropertiesRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
