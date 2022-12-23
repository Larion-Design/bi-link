import { gql, useLazyQuery } from '@apollo/client'
import { PersonListRecordWithImage } from '../../../types/person'

type Response = {
  getPersonInfo: PersonListRecordWithImage
}

type Params = {
  personId: string
}

const getPersonBasicInfo = gql`
  query PersonBasicInfo($personId: String!) {
    getPersonInfo(id: $personId) {
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

export const getPersonBasicInfoRequest = () =>
  useLazyQuery<Response, Params>(getPersonBasicInfo, {
    fetchPolicy: 'cache-first',
  })
