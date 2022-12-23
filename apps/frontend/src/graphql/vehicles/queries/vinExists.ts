import { gql } from '@apollo/client'
import { apolloClient } from '../../apolloClient'

type Params = {
  vin: string
  vehicleId?: string
}

type Response = {
  vinExists: boolean
}

const query = gql`
  query VINExists($vin: String!, $vehicleId: String) {
    vinExists(vin: $vin, vehicleId: $vehicleId)
  }
`

export const vinExists = async (vin: string, vehicleId?: string) => {
  const { data, error } = await apolloClient.query<Response, Params>({
    query,
    variables: {
      vin,
      vehicleId,
    },
  })

  if (error) {
    return error.message
  }
  if (data?.vinExists) {
    return 'Acest VIN este deja asociat unui alt vehicul.'
  }
}
