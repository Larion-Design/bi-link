import { gql, useLazyQuery } from '@apollo/client'
import { PersonAPIOutput } from '../../../types/person'

type Params = {
  personId: string
}

type Response = {
  getPersonInfo: PersonAPIOutput
}

const getPersonInfo = gql`
  query GetPerson($personId: String!) {
    getPersonInfo(id: $personId) {
      firstName
      lastName
      oldName
      cnp
      homeAddress
      birthdate
      image {
        fileId
      }
      contactDetails {
        fieldName
        fieldValue
      }
      relationships {
        person {
          _id
        }
        type
        proximity
        _confirmed
      }
      customFields {
        fieldName
        fieldValue
      }
      files {
        fileId
        name
        description
        isHidden
      }
      documents {
        documentType
        documentNumber
        issueDate
        expirationDate
      }
    }
  }
`

export const getPersonInfoRequest = () =>
  useLazyQuery<Response, Params>(getPersonInfo, { fetchPolicy: 'network-only' })
