import { gql, useLazyQuery } from '@apollo/client'
import { ProceedingAPIInput } from 'defs'

type Params = {
  proceedingId: string
}

type Response = {
  getProceeding: ProceedingAPIInput
}

const request = gql`
  query GetProceeding($proceedingId: ID!) {
    getProceeding(proceedingId: $proceedingId) {
      name
      type
      fileNumber {
        value
      }
      year {
        value
      }
      description
      reason {
        value
      }
      customFields {
        fieldName
        fieldValue
      }
      entitiesInvolved {
        person {
          _id
        }
        company {
          _id
        }
        involvedAs
        description
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

export const getProceedingRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
