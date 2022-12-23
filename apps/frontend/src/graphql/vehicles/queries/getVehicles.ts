import { gql, useLazyQuery } from '@apollo/client'
import { VehicleListRecord } from '../../../types/vehicle'

type Params = {
  vehiclesIds: string[]
}

type Response = {
  getVehicles: VehicleListRecord[]
}

const request = gql`
  query GetVehicles($vehiclesIds: [String!]!) {
    getVehicles(vehiclesIds: $vehiclesIds) {
      _id
      vin
      maker
      model
    }
  }
`

export const getVehiclesInfoRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
