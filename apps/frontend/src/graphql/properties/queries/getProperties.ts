import { gql, useLazyQuery } from '@apollo/client'
import { PropertyAPIOutput, PropertyListRecord } from 'defs'

type Params = {
  propertiesIds: string[]
}

type Response = {
  getProperties: PropertyAPIOutput[]
}

const request = gql`
  query GetProperties($propertiesIds: [ID!]!) {
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
