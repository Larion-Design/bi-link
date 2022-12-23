import { gql, useLazyQuery } from '@apollo/client'
import { VehicleAPIOutput } from '../../../types/vehicle'

type Params = {
  vehicleId: string
}

type Response = {
  getVehicle: VehicleAPIOutput
}

const request = gql`
  query GetVehicle($vehicleId: String!) {
    getVehicle(vehicleId: $vehicleId) {
      _id
      vin
      maker
      model
      color
      customFields {
        fieldName
        fieldValue
      }
      owners {
        person {
          _id
        }
        company {
          _id
        }
        startDate
        endDate
        registrationNumber
        _confirmed
      }
      files {
        fileId
        name
        description
        isHidden
      }
    }
  }
`

export const getVehicleRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
