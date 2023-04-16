import { gql, useLazyQuery } from '@apollo/client'
import { PersonAPIOutput } from 'defs'

type Response = {
  getPersonsInfo: PersonAPIOutput[]
}

type Params = {
  personsIds: string[]
}

const request = gql`
  query PersonBasicInfo($personsIds: [ID!]!) {
    getPersonsInfo(personsIds: $personsIds) {
      _id
      firstName {
        value
      }
      lastName {
        value
      }
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
