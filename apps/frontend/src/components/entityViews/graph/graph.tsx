import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import dagre, { Label } from 'dagre'
import { ConnectionLineType, Edge, Node, Position, ReactFlowProvider } from 'reactflow'
import { EntityLabel, EntityType } from 'defs'
import { useNotification } from '../../../utils/hooks/useNotification'
import { EntityGraph } from './entityGraph'
import { getEntitiesGraphRequest } from '../../../graphql/shared/queries/getEntitiesGraph'
import { getEntitiesInfoRequest } from '../../../graphql/shared/queries/getEntitiesInfo'
import { relationshipsTypes } from '../../form/relationships/utils'
import { getRelationshipLabelFromType } from './utils'

type Props = {
  entityId: string
  depth?: number
  onEntitySelected?: (entityId: string, entityType: EntityType) => void
  onRelationshipSelected?: () => void
  disableFilters?: boolean
  disableMap?: boolean
  disableControls?: boolean
  disableTitle?: boolean
}

const nodeConfig: Label = { width: 200, height: 150 }

export const Graph: React.FunctionComponent<Props> = ({
  entityId,
  depth,
  onEntitySelected,
  onRelationshipSelected,
  disableFilters,
  disableTitle,
  disableMap,
  disableControls,
}) => {
  const showNotification = useNotification()
  const [fetchGraph, { data, error: graphError }] = getEntitiesGraphRequest()
  const [fetchEntities, { data: entitiesInfo, error: entitiesInfoError }] = getEntitiesInfoRequest()

  const [graphDepth, updateDepth] = useState(depth ?? 2)
  const [allEntities, setAllEntities] = useState(new Set<string>())
  const [allRelationships, setAllRelationships] = useState(new Set<string>())

  const [visibleEntities, setVisibleEntities] = useState(new Set<string>())
  const [visibleRelationships, setVisibleRelationships] = useState(new Set<string>())

  const [nodes, setNodes] = useState<Node<unknown>[]>([])
  const [edges, setEdges] = useState<Edge<unknown>[]>([])

  useEffect(() => {
    void fetchGraph({ variables: { id: entityId, depth: graphDepth } })
  }, [graphDepth, entityId])

  useEffect(() => {
    if (graphError?.message || entitiesInfoError?.message) {
      showNotification('O eroare a intervenit in timpul comunicarii cu serverul.', 'error')
    }
  }, [graphError?.message, entitiesInfoError?.message])

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

      data.getEntitiesGraph.companiesAssociates.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
          _type,
        }) => {
          allRelationships.add(_type)
          allEntities.add(startNodeType)
          allEntities.add(endNodeType)

          entityHandlerMap[startNodeType](startNodeId)
          entityHandlerMap[endNodeType](endNodeId)
        },
      )

      data.getEntitiesGraph.personalRelationships.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
          _type,
          type,
        }) => {
          allRelationships.add(relationshipsTypes[type] ?? _type)
          allEntities.add(startNodeType)
          allEntities.add(endNodeType)

          entityHandlerMap[startNodeType](startNodeId)
          entityHandlerMap[endNodeType](endNodeId)
        },
      )

      data.getEntitiesGraph.incidentsParties.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
          _type,
        }) => {
          allRelationships.add(_type)
          allEntities.add(startNodeType)
          allEntities.add(endNodeType)

          entityHandlerMap[startNodeType](startNodeId)
          entityHandlerMap[endNodeType](endNodeId)
        },
      )

      data.getEntitiesGraph.propertiesRelationships.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
          _type,
        }) => {
          allRelationships.add(_type)
          allEntities.add(startNodeType)
          allEntities.add(endNodeType)

          entityHandlerMap[startNodeType](startNodeId)
          entityHandlerMap[endNodeType](endNodeId)
        },
      )

      setAllEntities(new Set(allEntities))
      setVisibleEntities(new Set(allEntities))
      setAllRelationships(new Set(allRelationships))
      setVisibleRelationships(new Set(allRelationships))

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
      const dagreGraph = new dagre.graphlib.Graph({ directed: true, compound: true })
      dagreGraph.setDefaultEdgeLabel(() => ({}))
      dagreGraph.setGraph({ rankdir: 'TB' })

      const nodesMap = new Map<string, Node>()
      const edgesMap = new Map<string, Edge>()

      const hiddenEntities: Record<EntityType, boolean> = {
        PERSON: !visibleEntities.has('PERSON'),
        COMPANY: !visibleEntities.has('COMPANY'),
        PROPERTY: !visibleEntities.has('PROPERTY'),
        INCIDENT: !visibleEntities.has('INCIDENT'),
        REPORT: true,
        FILE: true,
      }

      const createEdge = (
        startNodeId: string,
        endNodeId: string,
        label: string,
        _confirmed: boolean,
        type: string,
      ) => {
        const id = `${startNodeId}-${label}-${endNodeId}`
        const invertedId = `${endNodeId}-${label}-${startNodeId}`

        if (!edgesMap.has(id) && !edgesMap.has(invertedId)) {
          edgesMap.set(id, {
            id,
            source: startNodeId,
            target: endNodeId,
            hidden: !visibleRelationships.has(type),
            label,
            animated: !_confirmed,
            labelShowBg: false,
            type: _confirmed ? ConnectionLineType.Straight : ConnectionLineType.Step,
          })

          dagreGraph.setEdge(startNodeId, endNodeId)
        }
      }

      const entityHandler = {
        [EntityLabel.PERSON]: (personId: string) => {
          if (nodesMap.has(personId)) return

          dagreGraph.setNode(personId, nodeConfig)

          const personInfo = entitiesInfo?.getPersonsInfo.find(({ _id }) => personId === _id)

          if (personInfo) {
            nodesMap.set(personId, {
              id: personId,
              targetPosition: Position.Top,
              sourcePosition: Position.Bottom,
              hidden: hiddenEntities.PERSON && personId !== entityId,
              position: {
                x: 0,
                y: 0,
              },
              type: 'personNode',
              data: {
                label: `${personInfo.lastName} ${personInfo.firstName}`,
                image: personInfo.images?.[0]?.url.url,
                isRootNode: personId === entityId,
              },
            })
          }
        },
        [EntityLabel.COMPANY]: (companyId: string) => {
          if (nodesMap.has(companyId)) return

          dagreGraph.setNode(companyId, nodeConfig)

          const companyInfo = entitiesInfo?.getCompanies.find(({ _id }) => companyId === _id)

          if (companyInfo) {
            nodesMap.set(companyId, {
              id: companyId,
              targetPosition: Position.Top,
              sourcePosition: Position.Bottom,
              hidden: hiddenEntities.COMPANY && companyId !== entityId,
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

          dagreGraph.setNode(propertyId, nodeConfig)

          const propertyInfo = entitiesInfo?.getProperties.find(({ _id }) => propertyId === _id)

          if (propertyInfo) {
            nodesMap.set(propertyId, {
              id: propertyId,
              targetPosition: Position.Top,
              sourcePosition: Position.Bottom,
              hidden: hiddenEntities.PROPERTY && propertyId !== entityId,
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

          dagreGraph.setNode(incidentId, nodeConfig)

          const incidentInfo = entitiesInfo?.getIncidents.find(({ _id }) => incidentId === _id)

          if (incidentInfo) {
            nodesMap.set(incidentId, {
              id: incidentId,
              targetPosition: Position.Top,
              sourcePosition: Position.Bottom,
              hidden: hiddenEntities.INCIDENT && incidentId !== entityId,
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
            relationshipsTypes[type],
            _confirmed,
            relationshipsTypes[type] ?? type,
          )
        },
      )
      data.getEntitiesGraph.companiesAssociates.forEach(
        ({ startNode, endNode, role, _confirmed, equity, _type }) => {
          entityHandler[startNode._type](startNode._id)
          entityHandler[endNode._type](endNode._id)

          createEdge(
            startNode._id,
            endNode._id,
            equity > 0 ? `${role} (${equity}%)` : role,
            _confirmed,
            _type,
          )
        },
      )
      data.getEntitiesGraph.propertiesRelationships.forEach(
        ({ startNode, endNode, _confirmed, _type }) => {
          entityHandler[startNode._type](startNode._id)
          entityHandler[endNode._type](endNode._id)

          createEdge(
            startNode._id,
            endNode._id,
            getRelationshipLabelFromType(_type),
            _confirmed,
            _type,
          )
        },
      )
      data.getEntitiesGraph.incidentsParties.forEach(
        ({ startNode, endNode, name, _confirmed, _type }) => {
          entityHandler[startNode._type](startNode._id)
          entityHandler[endNode._type](endNode._id)
          createEdge(startNode._id, endNode._id, name, _confirmed, _type)
        },
      )

      dagre.layout(dagreGraph, { compound: true })

      setNodes(
        Array.from(nodesMap.values()).map((node) => {
          const { x, y } = dagreGraph.node(node.id)
          return { ...node, position: { x: x - 100, y: y - 75 } }
        }),
      )

      setEdges(Array.from(edgesMap.values()))
    }
  }, [data?.getEntitiesGraph, entitiesInfo, visibleEntities, visibleRelationships])

  return (
    <Box sx={{ width: 1, height: 1 }}>
      <ReactFlowProvider>
        <EntityGraph
          depth={graphDepth}
          updateDepth={updateDepth}
          data={{ nodes, edges }}
          onEntitySelected={onEntitySelected}
          onRelationshipSelected={onRelationshipSelected}
          allEntities={Array.from(allEntities)}
          visibleEntities={Array.from(visibleEntities)}
          setVisibleEntities={(entitiesTypes) => setVisibleEntities(new Set(entitiesTypes))}
          allRelationships={Array.from(allRelationships)}
          visibleRelationships={Array.from(visibleRelationships)}
          setVisibleRelationships={(relationshipsTypes) =>
            setVisibleRelationships(new Set(relationshipsTypes))
          }
          disableFilters={disableFilters}
          disableTitle={disableTitle}
          disableMap={disableMap}
          disableControls={disableControls}
        />
      </ReactFlowProvider>
    </Box>
  )
}
