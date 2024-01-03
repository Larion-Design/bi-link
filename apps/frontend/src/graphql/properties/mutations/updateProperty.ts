import { gql, useMutation } from '@apollo/client'
import { PropertyAPIInput } from 'defs'

type Params = {
  data: PropertyAPIInput
}

type Response = {
  updateProperty: boolean
}

const request = gql`
  mutation UpdateProperty($propertyId: ID!, $data: PropertyInput!) {
    updateProperty(propertyId: $propertyId, data: $data)
  }
`

export const updatePropertyRequest = () => useMutation<Response, Params>(request)
