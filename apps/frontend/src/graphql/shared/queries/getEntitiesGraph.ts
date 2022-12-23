import { gql, useQuery } from '@apollo/client'
import { EntitiesGraph } from '../../../types/entitiesGraph'

type Response = {
  getEntitiesGraph: EntitiesGraph
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
      incidentsParties {
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
    }
  }
`

export const getEntitiesGraphRequest = (entityId: string, depth = 2) =>
  useQuery<Response, Params>(request, {
    variables: { id: entityId, depth },
    fetchPolicy: 'cache-and-network',
  })
