import { gql } from '@apollo/client'
import { apolloClient } from '../../apolloClient'

export type Response = {
  personIdDocumentExists: boolean
}

export type Params = {
  documentNumber: string
  personId?: string
}

const personCNPExists = gql`
  query PersonRegistrationNumberExists($documentNumber: String!, $personId: String) {
    personIdDocumentExists(documentNumber: $documentNumber, personId: $personId)
  }
`

export const personIdDocumentRequest = (documentNumber: string, personId?: string) =>
  apolloClient.query<Response, Params>({
    query: personCNPExists,
    variables: {
      documentNumber,
      personId,
    },
  })
