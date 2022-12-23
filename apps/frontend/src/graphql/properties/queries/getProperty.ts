import { gql, useLazyQuery } from '@apollo/client'
import { PropertyAPIInput } from '../../../types/property'

type Params = {
  propertyId: string
}

type Response = {
  getProperty: PropertyAPIInput
}

const request = gql`
  query GetProperty($propertyId: String!) {
    getProperty(propertyId: $propertyId) {
      _id
      name
      type
      images {
        fileId
        isHidden
      }
      vehicleInfo {
        vin
        maker
        model
        color
      }
      customFields {
        _id
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
        startDate
        endDate
        customFields {
          _id
          fieldName
          fieldValue
        }
        vehicleOwnerInfo {
          registrationNumber
        }
        _confirmed
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
    fetchPolicy: 'cache-and-network',
  })
