import { gql, useLazyQuery } from '@apollo/client'
import { PropertyAPIOutput, PropertyListRecord } from 'defs'

type Params = {
  propertiesIds: string[]
}

type Response = {
  getProperties: PropertyAPIOutput[]
}

const request = gql`
  query GetProperties($propertiesIds: [String!]!) {
    getProperties(propertiesIds: $propertiesIds) {
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
          plateNumbers
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

export const getPropertiesInfoRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
