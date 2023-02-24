import Box from '@mui/material/Box'
import dagre, { Label } from 'dagre'
import { EntityLabel, EntityType } from 'defs'
import React, { PropsWithRef, useEffect, useState } from 'react'
import { ConnectionLineType, Edge, Node, Position, ReactFlowProvider } from 'reactflow'
import { getEntitiesGraphRequest } from '../../../graphql/shared/queries/getEntitiesGraph'
import { getEntitiesInfoRequest } from '../../../graphql/shared/queries/getEntitiesInfo'
import { useNotification } from '../../../utils/hooks/useNotification'
import { relationshipsTypes } from '../../form/relationships/utils'
import { EntityGraph } from './entityGraph'
import { getRelationshipLabelFromType } from './utils'

type Props = {
  id?: string
  title?: string
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

export const Graph: React.FunctionComponent<PropsWithRef<Props>> = ({
  id,
  title,
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

  const [visibleEntities, setVisibleEntities] = useState(new Set<string | EntityType>())
  const [visibleRelationships, setVisibleRelationships] = useState(new Set<string>())

  const [nodes, setNodes] = useState<Node<unknown>[]>([])
  const [edges, setEdges] = useState<Edge<unknown>[]>([])

  useEffect(() => {
    void fetchGraph({ variables: { id: entityId, depth: graphDepth } })
    setNodes([])
    setEdges([])
  }, [graphDepth, entityId])

  useEffect(() => {
    if (graphError?.message || entitiesInfoError?.message) {
      showNotification('O eroare a intervenit in timpul comunicarii cu serverul.', 'error')
    }
  }, [graphError?.message, entitiesInfoError?.message])

  useEffect(() => {
    if (!data?.getEntitiesGraph) return

    const companiesIds = new Set<string>()
    const personsIds = new Set<string>()
    const propertiesIds = new Set<string>()
    const eventsIds = new Set<string>()

    const registerNode = (entityId: string, entityType: EntityLabel) => {
      switch (entityType) {
        case EntityLabel.PERSON: {
          personsIds.add(entityId)
          break
        }
        case EntityLabel.COMPANY: {
          companiesIds.add(entityId)
          break
        }
        case EntityLabel.PROPERTY: {
          propertiesIds.add(entityId)
          break
        }
        case EntityLabel.EVENT: {
          eventsIds.add(entityId)
          break
        }
      }
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

        registerNode(startNodeId, startNodeType)
        registerNode(endNodeId, endNodeType)
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

        registerNode(startNodeId, startNodeType)
        registerNode(endNodeId, endNodeType)
      },
    )

    data.getEntitiesGraph.eventsParties.forEach(
      ({
        startNode: { _id: startNodeId, _type: startNodeType },
        endNode: { _id: endNodeId, _type: endNodeType },
        _type,
      }) => {
        allRelationships.add(_type)
        allEntities.add(startNodeType)
        allEntities.add(endNodeType)

        registerNode(startNodeId, startNodeType)
        registerNode(endNodeId, endNodeType)
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

        registerNode(startNodeId, startNodeType)
        registerNode(endNodeId, endNodeType)
      },
    )

    setAllEntities(new Set(allEntities))
    setVisibleEntities(new Set(allEntities))
    setAllRelationships(new Set(allRelationships))
    setVisibleRelationships(new Set(allRelationships))

    if (companiesIds.size || personsIds.size || propertiesIds.size || eventsIds.size) {
      void fetchEntities({
        variables: {
          companiesIds: Array.from(companiesIds),
          personsIds: Array.from(personsIds),
          propertiesIds: Array.from(propertiesIds),
          eventsIds: Array.from(eventsIds),
        },
      })
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
        EVENT: !visibleEntities.has('EVENT'),
        LOCATION: !visibleEntities.has('LOCATION'),
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

        if (!edgesMap.has(id) && !edgesMap.has(invertedId) && visibleRelationships.has(type)) {
          edgesMap.set(id, {
            id,
            source: startNodeId,
            target: endNodeId,
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
          if (nodesMap.has(personId) || hiddenEntities['PERSON']) return

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
          if (nodesMap.has(companyId) || hiddenEntities['COMPANY']) return

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
          if (nodesMap.has(propertyId) || hiddenEntities['PROPERTY']) return

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
        [EntityLabel.EVENT]: (eventId: string) => {
          if (nodesMap.has(eventId) || hiddenEntities['INCIDENT']) return

          dagreGraph.setNode(eventId, nodeConfig)

          const incidentInfo = entitiesInfo?.getIncidents.find(({ _id }) => eventId === _id)

          if (incidentInfo) {
            nodesMap.set(eventId, {
              id: eventId,
              targetPosition: Position.Top,
              sourcePosition: Position.Bottom,
              hidden: hiddenEntities.EVENT && eventId !== entityId,
              position: {
                x: 0,
                y: 0,
              },
              type: 'incidentNode',
              data: {
                label: incidentInfo.location,
                isRootNode: eventId === entityId,
              },
            })
          }
        },
      }

      data.getEntitiesGraph.personalRelationships.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
          type,
          _confirmed,
          _type,
        }) => {
          entityHandler[startNodeType](startNodeId)
          entityHandler[endNodeType](endNodeId)

          createEdge(
            startNodeId,
            endNodeId,
            relationshipsTypes[type],
            _confirmed,
            relationshipsTypes[type] ?? type,
          )
        },
      )
      data.getEntitiesGraph.companiesAssociates.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
          role,
          _confirmed,
          equity,
          _type,
        }) => {
          entityHandler[startNodeType](startNodeId)
          entityHandler[endNodeType](endNodeId)

          createEdge(
            startNodeId,
            endNodeId,
            equity > 0 ? `${role} (${equity}%)` : role,
            _confirmed,
            role.length ? role : _type,
          )
        },
      )
      data.getEntitiesGraph.propertiesRelationships.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
          _confirmed,
          _type,
        }) => {
          entityHandler[startNodeType](startNodeId)
          entityHandler[endNodeType](endNodeId)

          createEdge(startNodeId, endNodeId, getRelationshipLabelFromType(_type), _confirmed, _type)
        },
      )
      data.getEntitiesGraph.eventsParties.forEach(
        ({
          startNode: { _id: startNodeId, _type: startNodeType },
          endNode: { _id: endNodeId, _type: endNodeType },
          name,
          _confirmed,
          _type,
        }) => {
          entityHandler[startNodeType](startNodeId)
          entityHandler[endNodeType](endNodeId)
          createEdge(startNodeId, endNodeId, name, _confirmed, _type)
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
          id={id}
          title={title}
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
