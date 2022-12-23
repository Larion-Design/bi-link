import { gql } from '@apollo/client'

import { apolloClient } from '../../apolloClient'

export type Response = {
  personCNPExists: boolean
}

export type Params = {
  cnp: string
  personId?: string
}

const personCNPExists = gql`
  query PersonCNPExists($cnp: String!, $personId: String) {
    personCNPExists(cnp: $cnp, personId: $personId)
  }
`

export const personCNPRequest = (cnp: string, personId?: string) =>
  apolloClient.query<Response, Params>({
    query: personCNPExists,
    variables: {
      cnp,
      personId,
    },
  })
