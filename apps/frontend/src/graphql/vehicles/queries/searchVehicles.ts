import { gql, useLazyQuery } from '@apollo/client'
import { VehiclesSuggestions } from '../../../types/vehicle'

type Params = {
  searchTerm: string
  limit: number
  skip: number
}

type Response = {
  searchVehicles: VehiclesSuggestions
}

const request = gql`
  query SearchVehicles($searchTerm: String!, $limit: Int! = 20, $skip: Int! = 0) {
    searchVehicles(searchTerm: $searchTerm, skip: $skip, limit: $limit) {
      total
      records {
        _id
        vin
        model
        maker
      }
    }
  }
`

export const searchVehiclesRequest = () =>
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-first' })
