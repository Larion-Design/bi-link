import { gql, useMutation } from '@apollo/client'
import { PropertyAPIInput } from '../../../types/property'

type Params = {
  data: PropertyAPIInput
}

type Response = {
  updateProperty: boolean
}

const request = gql`
  mutation UpdateProperty($propertyId: String!, $data: PropertyInput!) {
    updateProperty(propertyId: $propertyId, data: $data)
  }
`

export const updatePropertyRequest = () => useMutation<Response, Params>(request)
