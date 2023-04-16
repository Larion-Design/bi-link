import { gql, useLazyQuery } from '@apollo/client'
import { ProceedingAPIOutput } from 'defs'

type Params = {
  proceedingsIds: string[]
}

type Response = {
  getProceedings: ProceedingAPIOutput[]
}

const request = gql`
  query GetProceedings($proceedingsIds: [ID!]!) {
    getProceedings(proceedingsIds: $proceedingsIds) {
      _id
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

export const getProceedingsRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
