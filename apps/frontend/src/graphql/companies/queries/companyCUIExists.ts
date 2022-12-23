import { gql } from '@apollo/client'
import { apolloClient } from '../../apolloClient'

export type Response = {
  companyCUIExists: boolean
}

export type Params = {
  cui: string
  companyId?: string
}

const companyCUIExists = gql`
  query CompanyCUIExists($cui: String!, $companyId: String) {
    companyCUIExists(cui: $cui, companyId: $companyId)
  }
`

export const companyCUIRequest = (cui: string, companyId?: string) =>
  apolloClient.query<Response, Params>({
    query: companyCUIExists,
    variables: {
      cui,
      companyId,
    },
  })
