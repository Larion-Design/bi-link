import { gql, useMutation } from '@apollo/client'
import { VehicleAPIInput, VehicleAPIOutput } from '../../../types/vehicle'

type Params = {
  data: VehicleAPIInput
}

type Response = {
  createVehicle: VehicleAPIOutput['_id']
}

const request = gql`
  mutation CreateVehicle($data: VehicleInput!) {
    createVehicle(data: $data)
  }
`

export const createVehicleRequest = () => useMutation<Response, Params>(request)
