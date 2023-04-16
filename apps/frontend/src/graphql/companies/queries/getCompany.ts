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
      name {
        value
      }
      cui {
        value
      }
      registrationNumber {
        value
      }
      headquarters {
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
        person {
          _id
        }
        company {
          _id
        }
        role {
          value
        }
        startDate {
          value
        }
        endDate {
          value
        }
        isActive {
          value
        }
        equity {
          value
        }
        customFields {
          fieldName
          fieldValue
        }
      }
      contactDetails {
        fieldName
        fieldValue
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
    }
  }
`

export const getCompanyInfoRequest = () =>
  useLazyQuery<Response, Params>(getCompany, {
    fetchPolicy: 'cache-and-network',
  })
