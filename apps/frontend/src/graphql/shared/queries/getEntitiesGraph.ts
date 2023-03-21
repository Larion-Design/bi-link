import { gql, useLazyQuery } from '@apollo/client'
import { Graph } from 'defs'

type Response = {
  getEntitiesGraph: Graph
}

type Params = {
  id: string
  depth: number
}

const request = gql`
  query GetEntitiesGraph($id: String!, $depth: Int!) {
    getEntitiesGraph(id: $id, depth: $depth) {
      relationships {
        companiesBranches {
          _confirmed
          _type
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
        companiesHeadquarters {
          _confirmed
          _type
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
        companiesAssociates {
          _confirmed
          _type
          role
          equity
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
        personalRelationships {
          _type
          _confirmed
          type
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
        personsBirthPlace {
          _type
          _confirmed
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
        personsHomeAddress {
          _type
          _confirmed
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
        propertiesLocation {
          _type
          _confirmed
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
        propertiesRelationships {
          _type
          _confirmed
          startDate
          endDate
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
        eventsParties {
          _type
          _confirmed
          name
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
        eventsOccurrencePlace {
          _confirmed
          _type
          startNode {
            _id
            _type
          }
          endNode {
            _id
            _type
          }
        }
      }
      entities {
        persons {
          _id
          firstName
          lastName
          images {
            fileId
            url {
              url
            }
          }
        }
        companies {
          _id
          name
          cui
          registrationNumber
        }
        properties {
          _id
          name
          type
        }
        events {
          _id
          date
          type
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
        }
        reports {
          _id
          name
          type
        }
        proceedings {
          _id
          fileNumber
          name
          type
          year
        }
      }
    }
  }
`

export const getEntitiesGraphRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
