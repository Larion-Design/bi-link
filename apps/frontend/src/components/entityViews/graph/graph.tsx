import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import dagre from 'dagre'
import { ConnectionLineType, Edge, Node, Position, ReactFlowProvider } from 'reactflow'
import { EntityGraph } from './entityGraph'
import { getEntitiesGraphRequest } from '../../../graphql/shared/queries/getEntitiesGraph'
import { Loader } from '../../loader/loader'
import { getEntitiesInfoRequest } from '../../../graphql/shared/queries/getEntitiesInfo'
import { EntityLabel, RelationshipLabel } from 'defs'
import { relationshipsTypes } from '../../form/relationships/utils'

type Props = {
  entityId: string
}

export const Graph: React.FunctionComponent<Props> = ({ entityId }) => {
  const { data, loading: loadingGraph } = getEntitiesGraphRequest(entityId)
  const [fetchEntities, { data: entitiesInfo, loading: loadingEntities }] = getEntitiesInfoRequest()

  const [nodes, setNodes] = useState<Node<unknown>[] | null>(null)
  const [edges, setEdges] = useState<Edge<unknown>[] | null>(null)

  useEffect(() => {
    if (data?.getEntitiesGraph) {
      const companiesIds = new Set<string>()
      const personsIds = new Set<string>()
      const propertiesIds = new Set<string>()
      const incidentsIds = new Set<string>()

      const entityHandlerMap: Record<
        EntityLabel.PERSON | EntityLabel.COMPANY | EntityLabel.PROPERTY | EntityLabel.INCIDENT,
        (entityId: string) => void
      > = {
        [EntityLabel.PERSON]: (personId: string) => personsIds.add(personId),
        [EntityLabel.COMPANY]: (companyId: string) => companiesIds.add(companyId),
        [EntityLabel.PROPERTY]: (propertyId: string) => propertiesIds.add(propertyId),
        [EntityLabel.INCIDENT]: (incidentId: string) => incidentsIds.add(incidentId),
      }

      data?.getEntitiesGraph.companiesAssociates.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
        }) => {
          entityHandlerMap[startNodeType](startNodeId)
          entityHandlerMap[endNodeType](endNodeId)
        },
      )

      data?.getEntitiesGraph.personalRelationships.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
        }) => {
          entityHandlerMap[startNodeType](startNodeId)
          entityHandlerMap[endNodeType](endNodeId)
        },
      )

      data?.getEntitiesGraph.incidentsParties.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
        }) => {
          entityHandlerMap[startNodeType](startNodeId)
          entityHandlerMap[endNodeType](endNodeId)
        },
      )

      data?.getEntitiesGraph.propertiesRelationships.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
        }) => {
          entityHandlerMap[startNodeType](startNodeId)
          entityHandlerMap[endNodeType](endNodeId)
        },
      )

      if (companiesIds.size || personsIds.size || propertiesIds.size || incidentsIds.size) {
        void fetchEntities({
          variables: {
            companiesIds: Array.from(companiesIds.values()),
            personsIds: Array.from(personsIds.values()),
            propertiesIds: Array.from(propertiesIds.values()),
            incidentsIds: Array.from(incidentsIds.values()),
          },
        })
      }
    }
  }, [data?.getEntitiesGraph])

  useEffect(() => {
    if (data?.getEntitiesGraph && entitiesInfo) {
      const dagreGraph = new dagre.graphlib.Graph()
      dagreGraph.setDefaultEdgeLabel(() => ({}))
      dagreGraph.setGraph({ rankdir: 'TB' })

      const nodesMap = new Map<string, Node>()
      const edgesMap = new Map<string, Edge>()

      const createEdge = (
        startNodeId: string,
        endNodeId: string,
        label: string,
        _confirmed: boolean,
      ) => {
        const id = `${startNodeId}-${label}-${endNodeId}`
        const invertedId = `${endNodeId}-${label}-${startNodeId}`

        if (!edgesMap.has(id) && !edgesMap.has(invertedId)) {
          edgesMap.set(id, {
            id,
            source: startNodeId,
            target: endNodeId,
            label,
            animated: _confirmed,
            labelShowBg: false,
            type: _confirmed ? ConnectionLineType.SimpleBezier : ConnectionLineType.Step,
          })

          dagreGraph.setEdge(startNodeId, endNodeId)
        }
      }

      const entityHandler = {
        [EntityLabel.PERSON]: (personId: string) => {
          if (nodesMap.has(personId)) return

          dagreGraph.setNode(personId, { width: 200, height: 150 })

          const personInfo = entitiesInfo?.getPersonsInfo.find(({ _id }) => personId === _id)

          if (personInfo) {
            nodesMap.set(personId, {
              id: personId,
              targetPosition: Position.Top,
              sourcePosition: Position.Bottom,
              position: {
                x: 0,
                y: 0,
              },
              type: 'personNode',
              data: {
                label: `${personInfo.lastName} ${personInfo.firstName}`,
                isRootNode: personId === entityId,
              },
            })
          }
        },
        [EntityLabel.COMPANY]: (companyId: string) => {
          if (nodesMap.has(companyId)) return

          dagreGraph.setNode(companyId, { width: 200, height: 150 })

          const companyInfo = entitiesInfo?.getCompanies.find(({ _id }) => companyId === _id)

          if (companyInfo) {
            nodesMap.set(companyId, {
              id: companyId,
              targetPosition: Position.Top,
              sourcePosition: Position.Bottom,
              position: {
                x: 0,
                y: 0,
              },
              type: 'companyNode',
              data: {
                label: companyInfo.name,
                isRootNode: companyId === entityId,
              },
            })
          }
        },
        [EntityLabel.PROPERTY]: (propertyId: string) => {
          if (nodesMap.has(propertyId)) return

          dagreGraph.setNode(propertyId, { width: 200, height: 150 })

          const propertyInfo = entitiesInfo?.getProperties.find(({ _id }) => propertyId === _id)

          if (propertyInfo) {
            nodesMap.set(propertyId, {
              id: propertyId,
              targetPosition: Position.Top,
              sourcePosition: Position.Bottom,
              position: {
                x: 0,
                y: 0,
              },
              type: 'propertyNode',
              data: {
                label: propertyInfo.name,
                isRootNode: propertyId === entityId,
              },
            })
          }
        },
        [EntityLabel.INCIDENT]: (incidentId: string) => {
          if (nodesMap.has(incidentId)) return

          dagreGraph.setNode(incidentId, { width: 200, height: 150 })

          const incidentInfo = entitiesInfo?.getIncidents.find(({ _id }) => incidentId === _id)

          if (incidentInfo) {
            nodesMap.set(incidentId, {
              id: incidentId,
              targetPosition: Position.Top,
              sourcePosition: Position.Bottom,
              position: {
                x: 0,
                y: 0,
              },
              type: 'incidentNode',
              data: {
                label: incidentInfo.location,
                isRootNode: incidentId === entityId,
              },
            })
          }
        },
      }

      data.getEntitiesGraph.personalRelationships.forEach(
        ({ startNode, endNode, type, _confirmed, _type }) => {
          entityHandler[startNode._type](startNode._id)
          entityHandler[endNode._type](endNode._id)

          createEdge(
            startNode._id,
            endNode._id,
            relationshipsTypes[type] ?? getRelationshipLabelFromType(_type),
            _confirmed,
          )
        },
      )
      data.getEntitiesGraph.companiesAssociates.forEach(
        ({ startNode, endNode, role, _confirmed, equity }) => {
          entityHandler[startNode._type](startNode._id)
          entityHandler[endNode._type](endNode._id)

          createEdge(
            startNode._id,
            endNode._id,
            equity > 0 ? `${role} (${equity}%)` : role,
            _confirmed,
          )
        },
      )
      data.getEntitiesGraph.propertiesRelationships.forEach(
        ({ startNode, endNode, _confirmed, _type }) => {
          entityHandler[startNode._type](startNode._id)
          entityHandler[endNode._type](endNode._id)

          createEdge(startNode._id, endNode._id, getRelationshipLabelFromType(_type), _confirmed)
        },
      )
      data.getEntitiesGraph.incidentsParties.forEach(
        ({ startNode, endNode, name, _confirmed, _type }) => {
          entityHandler[startNode._type](startNode._id)
          entityHandler[endNode._type](endNode._id)
          createEdge(startNode._id, endNode._id, name, _confirmed)
        },
      )

      dagre.layout(dagreGraph)

      setNodes(
        Array.from(nodesMap.values()).map((node) => {
          const { x, y } = dagreGraph.node(node.id)
          return { ...node, position: { x: x - 100, y: y - 75 } }
        }),
      )

      setEdges(Array.from(edgesMap.values()))
    }
  }, [data?.getEntitiesGraph, entitiesInfo])

  if (loadingGraph || loadingEntities) {
    return <Loader visible={true} message={'Se incarca graficul relational'} />
  }
  return nodes?.length && edges?.length ? (
    <Box sx={{ width: 1, height: '70vh' }}>
      <ReactFlowProvider>
        <EntityGraph
          data={{ nodes, edges }}
          onEntitySelected={(entityInfo) => console.debug(entityInfo)}
          onEdgeSelected={(sourceEntityId, targetEntityId) =>
            console.debug(sourceEntityId, targetEntityId)
          }
        />
      </ReactFlowProvider>
    </Box>
  ) : null
}

const getRelationshipLabelFromType = (relationshipType: string | RelationshipLabel) => {
  const labels: Record<
    | RelationshipLabel.RELATED
    | RelationshipLabel.ASSOCIATE
    | RelationshipLabel.PARTY_INVOLVED
    | RelationshipLabel.OWNER,
    string
  > = {
    [RelationshipLabel.RELATED]: 'Cunoaște',
    [RelationshipLabel.ASSOCIATE]: 'Asociat',
    [RelationshipLabel.PARTY_INVOLVED]: 'Implicat in incident',
    [RelationshipLabel.OWNER]: 'Proprietar',
  }
  return labels[relationshipType] ?? relationshipType
}
