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
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        companiesHeadquarters {
          _confirmed
          _type
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        companiesAssociates {
          _confirmed
          _type
          role
          equity
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        personalRelationships {
          _type
          _confirmed
          type
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        personsBirthPlace {
          _type
          _confirmed
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        personsHomeAddress {
          _type
          _confirmed
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        propertiesLocation {
          _type
          _confirmed
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        propertiesRelationships {
          _type
          _confirmed
          startDate
          endDate
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        eventsParties {
          _type
          _confirmed
          name
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        eventsOccurrencePlace {
          _confirmed
          _type
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
        entitiesInvolvedInProceeding {
          _confirmed
          _type
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
          involvedAs
        }
        entitiesReported {
          _confirmed
          _type
          startNode {
            entityId
            entityType
          }
          endNode {
            entityId
            entityType
          }
        }
      }
      entities {
        persons {
          _id
          firstName {
            value
          }
          lastName {
            value
          }
          images {
            fileId
            url {
              url
            }
          }
        }
        companies {
          _id
          name {
            value
          }
          cui {
            value
          }
          registrationNumber {
            value
          }
        }
        properties {
          _id
          name
          type
        }
        events {
          _id
          date {
            value
          }
          type {
            value
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
        }
        reports {
          _id
          name
          type
        }
        proceedings {
          _id
          fileNumber {
            value
          }
          name
          type
          year {
            value
          }
        }
      }
    }
  }
`

export const getEntitiesGraphRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
