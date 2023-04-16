import { gql, useLazyQuery } from '@apollo/client'
import { PropertyAPIInput } from 'defs'

type Params = {
  propertyId: string
}

type Response = {
  getProperty: PropertyAPIInput
}

const request = gql`
  query GetProperty($propertyId: String!) {
    getProperty(propertyId: $propertyId) {
      name
      type
      images {
        fileId
        isHidden
      }
      vehicleInfo {
        vin {
          value
        }
        maker {
          value
        }
        model {
          value
        }
        color {
          value
        }
      }
      customFields {
        fieldName
        fieldValue
      }
      owners {
        person {
          _id
        }
        company {
          _id
        }
        startDate {
          value
        }
        endDate {
          value
        }
        customFields {
          fieldName
          fieldValue
        }
        vehicleOwnerInfo {
          plateNumbers
        }
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

export const getPropertyRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
