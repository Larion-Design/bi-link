import { gql, useLazyQuery } from '@apollo/client'
import { PersonAPIOutput } from 'defs'

type Response = {
  getPersonsInfo: PersonAPIOutput[]
}

type Params = {
  personsIds: string[]
}

const request = gql`
  query PersonsInfo($personsIds: [ID!]!) {
    getPersonsInfo(personsIds: $personsIds) {
      _id
      firstName {
        value
      }
      lastName {
        value
      }
      oldNames {
        name
        changeReason
      }
      cnp {
        value
      }
      homeAddress {
        locationId
        street
        number
        building
        door
        zipCode
        locality
        county
        country
        otherInfo
        coordinates {
          lat
          long
        }
      }
      birthdate {
        value
      }
      images {
        fileId
        name
        description
        isHidden
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

export const getPersonsInfoRequest = () =>
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-and-network' })
