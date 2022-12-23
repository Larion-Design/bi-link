import { gql, useLazyQuery } from '@apollo/client'

import { PersonListRecordWithImage } from '../../../types/person'

type Response = {
  getPersonsInfo: PersonListRecordWithImage[]
}

type Params = {
  personsIds: string[]
}

const getPersonsBasicInfo = gql`
  query PersonBasicInfo($personsIds: [String!]!) {
    getPersonsInfo(personsIds: $personsIds) {
      _id
      firstName
      lastName
      image {
        url {
          url
        }
      }
    }
  }
`

export const getPersonsBasicInfoRequest = () => useLazyQuery<Response, Params>(getPersonsBasicInfo)
