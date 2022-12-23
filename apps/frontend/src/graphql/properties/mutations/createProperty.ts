import { gql, useMutation } from '@apollo/client'
import { PropertyAPIInput, PropertyAPIOutput } from '../../../types/property'

type Params = {
  data: PropertyAPIInput
}

type Response = {
  createProperty: PropertyAPIOutput['_id']
}

const request = gql`
  mutation CreateProperty($data: PropertyInput!) {
    createProperty(data: $data)
  }
`

export const createPropertyRequest = () => useMutation<Response, Params>(request)
