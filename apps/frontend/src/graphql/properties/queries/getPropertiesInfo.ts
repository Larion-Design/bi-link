import { gql, useLazyQuery } from '@apollo/client'
import { PropertyAPIOutput } from 'defs'

type Params = {
  propertiesIds: string[]
}

type Response = {
  getProperties: PropertyAPIOutput[]
}

const request = gql`
  query GetProperties($propertiesIds: [ID!]!) {
    getProperties(propertiesIds: $propertiesIds) {
      _id
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

export const getPropertiesInfoRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
