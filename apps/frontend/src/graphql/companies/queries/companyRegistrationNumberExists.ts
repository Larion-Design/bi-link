import { gql } from '@apollo/client'
import { apolloClient } from '../../apolloClient'

export type Response = {
  companyRegistrationNumberExists: boolean
}

export type Params = {
  registrationNumber: string
  companyId?: string
}

const companyIdentifierExists = gql`
  query CompanyCUIExists($registrationNumber: String!, $companyId: ID) {
    companyRegistrationNumberExists(registrationNumber: $registrationNumber, companyId: $companyId)
  }
`

export const companyRegistrationNumberRequest = (registrationNumber: string, companyId?: string) =>
  apolloClient.query<Response, Params>({
    query: companyIdentifierExists,
    variables: {
      registrationNumber,
      companyId,
    },
  })
