import { gql, useLazyQuery } from '@apollo/client'
import { PersonAPIOutput } from 'defs'

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
      oldNames {
        name
        changeReason
      }
      cnp
      birthPlace {
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
      birthdate
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
        relatedPersons {
          _id
        }
        type
        proximity
        description
        relatedPersons {
          _id
        }
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
      education {
        type
        school
        specialization
        customFields {
          fieldName
          fieldValue
        }
        startDate
        endDate
      }
    }
  }
`

export const getPersonInfoRequest = () =>
  useLazyQuery<Response, Params>(getPersonInfo, { fetchPolicy: 'network-only' })
