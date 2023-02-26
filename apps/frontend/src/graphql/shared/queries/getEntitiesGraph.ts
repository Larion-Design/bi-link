import { gql, useLazyQuery } from '@apollo/client'
import { GraphRelationships } from 'defs'

type Response = {
  getEntitiesGraph: GraphRelationships
}

type Params = {
  id: string
  depth: number
}

const request = gql`
  query GetEntitiesGraph($id: String!, $depth: Int!) {
    getEntitiesGraph(id: $id, depth: $depth) {
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
      eventsOccurencePlace {
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
  }
`

export const getEntitiesGraphRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
