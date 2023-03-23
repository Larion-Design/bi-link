import { gql, useLazyQuery } from '@apollo/client'
import { CompanyAPIInput } from 'defs'

type Params = {
  id: string
}

type Response = {
  getCompany: CompanyAPIInput
}

const getCompany = gql`
  query GetCompany($id: String!) {
    getCompany(id: $id) {
      name
      cui
      registrationNumber
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
        role
        startDate
        endDate
        isActive
        equity
        customFields {
          _id
          fieldName
          fieldValue
        }
        _confirmed
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
