import { gql, useLazyQuery } from '@apollo/client'

import { PersonListRecordWithImage } from 'defs'

type Response = {
  getPersonsInfo: PersonListRecordWithImage[]
}

type Params = {
  personsIds: string[]
}

const request = gql`
  query PersonBasicInfo($personsIds: [String!]!) {
    getPersonsInfo(personsIds: $personsIds) {
      _id
      firstName
      lastName
      images {
        fileId
        url {
          url
        }
      }
    }
  }
`

export const getPersonsBasicInfoRequest = () => useLazyQuery<Response, Params>(request)
