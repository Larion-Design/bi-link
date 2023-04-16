import { gql, useLazyQuery } from '@apollo/client'
import { PersonAPIOutput } from 'defs'

type Params = {
  personId: string
}

type Response = {
  getPersonInfo: PersonAPIOutput
}

const getPersonInfo = gql`
  query GetPerson($personId: ID!) {
    getPersonInfo(id: $personId) {
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
        relatedPersons {
          _id
        }
        type
        proximity
        description
        relatedPersons {
          _id
        }
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
        startDate
        endDate
      }
    }
  }
`

export const getPersonInfoRequest = () =>
  useLazyQuery<Response, Params>(getPersonInfo, { fetchPolicy: 'network-only' })
