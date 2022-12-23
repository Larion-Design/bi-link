import { gql, useMutation } from '@apollo/client'
import { VehicleAPIInput } from '../../../types/vehicle'

type Params = {
  data: VehicleAPIInput
}

type Response = {
  updateVehicle: boolean
}

const request = gql`
  mutation UpdateVehicle($vehicleId: String!, $data: VehicleInput!) {
    updateVehicle(vehicleId: $vehicleId, data: $data)
  }
`

export const updateVehicleRequest = () => useMutation<Response, Params>(request)
