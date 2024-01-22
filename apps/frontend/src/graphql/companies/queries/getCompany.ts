import { gql, useLazyQuery } from '@apollo/client'
import { CompanyAPIInput } from 'defs'

type Params = {
  id: string
}

type Response = {
  getCompany: CompanyAPIInput
}

const getCompany = gql`
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
      metadata {
        confirmed
        access
        trustworthiness {
          level
          source
        }
      }
      name {
        value
        metadata {
          access
          confirmed
          trustworthiness {
            level
            source
          }
        }
      }
      cui {
        value
        metadata {
          access
          confirmed
          trustworthiness {
            level
            source
          }
        }
      }
      registrationNumber {
        value
        metadata {
          access
          confirmed
          trustworthiness {
            level
            source
          }
        }
      }
      headquarters {
        metadata {
          access
          confirmed
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
      locations {
        metadata {
          access
          confirmed
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
      associates {
        metadata {
          access
          confirmed
          trustworthiness {
            level
            source
          }
        }
        person {
          _id
        }
        company {
          _id
        }
        role {
          value
          metadata {
            access
            confirmed
            trustworthiness {
              level
              source
            }
          }
        }
        startDate {
          value
          metadata {
            access
            confirmed
            trustworthiness {
              level
              source
            }
          }
        }
        endDate {
          value
          metadata {
            access
            confirmed
            trustworthiness {
              level
              source
            }
          }
        }
        isActive {
          value
          metadata {
            access
            confirmed
            trustworthiness {
              level
              source
            }
          }
        }
        equity {
          value
          metadata {
            access
            confirmed
            trustworthiness {
              level
              source
            }
          }
        }
        customFields {
          metadata {
            access
            confirmed
            trustworthiness {
              level
              source
            }
          }
          fieldName
          fieldValue
        }
      }
      contactDetails {
        metadata {
          access
          confirmed
          trustworthiness {
            level
            source
          }
        }
        fieldName
        fieldValue
      }
      customFields {
        metadata {
          access
          confirmed
          trustworthiness {
            level
            source
          }
        }
        fieldName
        fieldValue
      }
      files {
        metadata {
          access
          confirmed
          trustworthiness {
            level
            source
          }
        }
        fileId
        name
        description
        isHidden
      }
      images {
        metadata {
          access
          confirmed
          trustworthiness {
            level
            source
          }
        }
        fileId
        name
        description
        isHidden
      }
      relationships {
        metadata {
          access
          confirmed
          trustworthiness {
            level
            source
          }
        }
        person {
          _id
        }
        company {
          _id
        }
        type
        customFields {
          metadata {
            access
            confirmed
            trustworthiness {
              level
              source
            }
          }
          fieldName
          fieldValue
        }
      }
    }
  }
`

export const getCompanyInfoRequest = () =>
  useLazyQuery<Response, Params>(getCompany, {
    fetchPolicy: 'cache-and-network',
  })
