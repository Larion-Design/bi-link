import { gql, useLazyQuery } from '@apollo/client'
import { PersonAPIOutput } from 'defs'

type Params = {
  personId: string
}

type Response = {
  getPersonInfo: PersonAPIOutput
}

const query = gql`
  query GetPerson($personId: ID!) {
    getPersonInfo(id: $personId) {
      metadata {
        confirmed
        access
        trustworthiness {
          level
          source
        }
      }
      firstName {
        value
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      lastName {
        value
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      oldNames {
        name
        changeReason
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      cnp {
        value
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      birthPlace {
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
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
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
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
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      images {
        fileId
        name
        description
        isHidden
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      contactDetails {
        fieldName
        fieldValue
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      relationships {
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
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
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      files {
        fileId
        name
        description
        isHidden
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      documents {
        documentType
        documentNumber
        issueDate
        expirationDate
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
      education {
        type
        school
        specialization
        startDate
        endDate
        metadata {
          confirmed
          access
          trustworthiness {
            level
            source
          }
        }
      }
    }
  }
`

export const getPersonInfoRequest = () =>
  useLazyQuery<Response, Params>(query, { fetchPolicy: 'network-only' })
