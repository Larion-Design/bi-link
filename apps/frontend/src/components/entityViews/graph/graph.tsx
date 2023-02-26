import React, { PropsWithRef, useEffect, useState } from 'react'
import { relationshipsTypes } from '@frontend/components/form/person/constants'
import { getLocationAddress } from '@frontend/utils/location'
import Box from '@mui/material/Box'
import dagre, { Label } from 'dagre'
import { EntityLabel, EntityLocationRelationship, EntityType } from 'defs'
import { ConnectionLineType, Edge, Node, Position, ReactFlowProvider } from 'reactflow'
import { getEntitiesGraphRequest } from '../../../graphql/shared/queries/getEntitiesGraph'
import { useNotification } from '../../../utils/hooks/useNotification'
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
  const [fetchGraph, { data, error, loading }] = getEntitiesGraphRequest()

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
    if (error?.message) {
      showNotification('Server Error', 'error')
    }
  }, [error?.message])

  useEffect(() => {
    if (!data?.getEntitiesGraph) return

    allEntities.clear()
    allRelationships.clear()

    const {
      companiesAssociates,
      companiesHeadquarters,
      companiesBranches,
      personalRelationships,
      propertiesRelationships,
      personsBirthPlace,
      personsHomeAddress,
      propertiesLocation,
      eventsOccurrencePlace,
      eventsParties,
    } = data.getEntitiesGraph.relationships

    const entityLocationHandler = ({
      startNode: { _type: startNodeType },
      endNode: { _type: endNodeType },
      _type,
    }: EntityLocationRelationship) => {
      allRelationships.add(_type)
      allEntities.add(startNodeType)
      allEntities.add(endNodeType)
    }

    companiesHeadquarters.forEach(entityLocationHandler)
    companiesBranches.forEach(entityLocationHandler)
    personsBirthPlace.forEach(entityLocationHandler)
    personsHomeAddress.forEach(entityLocationHandler)
    propertiesLocation.forEach(entityLocationHandler)
    eventsOccurrencePlace.forEach(entityLocationHandler)

    companiesAssociates.forEach(
      ({ startNode: { _type: startNodeType }, endNode: { _type: endNodeType }, _type }) => {
        allRelationships.add(_type)
        allEntities.add(startNodeType)
        allEntities.add(endNodeType)
      },
    )

    personalRelationships.forEach(
      ({ startNode: { _type: startNodeType }, endNode: { _type: endNodeType }, _type, type }) => {
        allRelationships.add(relationshipsTypes[type] ?? _type)
        allEntities.add(startNodeType)
        allEntities.add(endNodeType)
      },
    )

    eventsParties.forEach(
      ({ startNode: { _type: startNodeType }, endNode: { _type: endNodeType }, _type }) => {
        allRelationships.add(_type)
        allEntities.add(startNodeType)
        allEntities.add(endNodeType)
      },
    )

    propertiesRelationships.forEach(
      ({ startNode: { _type: startNodeType }, endNode: { _type: endNodeType }, _type }) => {
        allRelationships.add(_type)
        allEntities.add(startNodeType)
        allEntities.add(endNodeType)
      },
    )

    setAllEntities(new Set(allEntities))
    setVisibleEntities(new Set(allEntities))
    setAllRelationships(new Set(allRelationships))
    setVisibleRelationships(new Set(allRelationships))
  }, [data?.getEntitiesGraph])

  useEffect(() => {
    if (!data?.getEntitiesGraph) return

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

        dagreGraph.setEdge(startNodeId, endNodeId, label)
      }
    }

    const {
      relationships: {
        companiesAssociates,
        companiesHeadquarters,
        companiesBranches,
        personalRelationships,
        propertiesRelationships,
        personsBirthPlace,
        personsHomeAddress,
        propertiesLocation,
        eventsOccurrencePlace,
        eventsParties,
      },
      entities: { persons, companies, properties, events, locations },
    } = data.getEntitiesGraph

    const entityHandler = {
      [EntityLabel.PERSON]: (personId: string) => {
        if (hiddenEntities['PERSON']) return false
        if (nodesMap.has(personId)) return true

        const personInfo = persons.find(({ _id }) => personId === _id)

        if (personInfo) {
          dagreGraph.setNode(personId, nodeConfig)

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
          return true
        }
      },
      [EntityLabel.COMPANY]: (companyId: string) => {
        if (hiddenEntities['COMPANY']) return false
        if (nodesMap.has(companyId)) return true

        const companyInfo = companies.find(({ _id }) => companyId === _id)

        if (companyInfo) {
          dagreGraph.setNode(companyId, nodeConfig)

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
          return true
        }
      },
      [EntityLabel.PROPERTY]: (propertyId: string) => {
        if (hiddenEntities['PROPERTY']) return false
        if (nodesMap.has(propertyId)) return true

        const propertyInfo = properties.find(({ _id }) => propertyId === _id)

        if (propertyInfo) {
          dagreGraph.setNode(propertyId, nodeConfig)

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
          return true
        }
      },
      [EntityLabel.EVENT]: (eventId: string) => {
        if (hiddenEntities['EVENT']) return false
        if (nodesMap.has(eventId)) return true

        dagreGraph.setNode(eventId, nodeConfig)

        const eventInfo = events.find(({ _id }) => eventId === _id)

        if (eventInfo) {
          nodesMap.set(eventId, {
            id: eventId,
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            hidden: hiddenEntities.EVENT && eventId !== entityId,
            position: {
              x: 0,
              y: 0,
            },
            type: 'eventNode',
            data: {
              label: eventInfo.location,
              isRootNode: eventId === entityId,
            },
          })
        }
      },
      [EntityLabel.LOCATION]: (locationId: string) => {
        if (hiddenEntities['LOCATION']) return false
        if (nodesMap.has(locationId)) return true

        dagreGraph.setNode(locationId, nodeConfig)

        const locationInfo = locations.find(({ _id }) => locationId === _id)

        if (locationInfo) {
          nodesMap.set(locationId, {
            id: locationId,
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            hidden: hiddenEntities.LOCATION && locationId !== entityId,
            position: {
              x: 0,
              y: 0,
            },
            type: 'locationNode',
            data: {
              label: getLocationAddress(locationInfo),
              isRootNode: locationId === entityId,
            },
          })
        }
      },
    }

    personalRelationships.forEach(
      ({
        startNode: { _id: startNodeId, _type: startNodeType },
        endNode: { _id: endNodeId, _type: endNodeType },
        type,
        _confirmed,
        _type,
      }) => {
        if (entityHandler[startNodeType](startNodeId) && entityHandler[endNodeType](endNodeId)) {
          createEdge(
            startNodeId,
            endNodeId,
            relationshipsTypes[type],
            _confirmed,
            relationshipsTypes[type] ?? type,
          )
        }
      },
    )
    companiesAssociates.forEach(
      ({
        startNode: { _id: startNodeId, _type: startNodeType },
        endNode: { _id: endNodeId, _type: endNodeType },
        role,
        _confirmed,
        equity,
        _type,
      }) => {
        if (entityHandler[startNodeType](startNodeId) && entityHandler[endNodeType](endNodeId)) {
          createEdge(
            startNodeId,
            endNodeId,
            equity > 0 ? `${role} (${equity}%)` : role,
            _confirmed,
            role.length ? role : _type,
          )
        }
      },
    )
    propertiesRelationships.forEach(
      ({
        startNode: { _id: startNodeId, _type: startNodeType },
        endNode: { _id: endNodeId, _type: endNodeType },
        _confirmed,
        _type,
      }) => {
        if (entityHandler[startNodeType](startNodeId) && entityHandler[endNodeType](endNodeId)) {
          createEdge(startNodeId, endNodeId, getRelationshipLabelFromType(_type), _confirmed, _type)
        }
      },
    )
    eventsParties.forEach(
      ({
        startNode: { _id: startNodeId, _type: startNodeType },
        endNode: { _id: endNodeId, _type: endNodeType },
        name,
        _confirmed,
        _type,
      }) => {
        if (entityHandler[startNodeType](startNodeId) && entityHandler[endNodeType](endNodeId)) {
          createEdge(startNodeId, endNodeId, name, _confirmed, _type)
        }
      },
    )

    const entityLocationEdgeHandler = ({
      startNode: { _id: startNodeId, _type: startNodeType },
      endNode: { _id: endNodeId, _type: endNodeType },
      _confirmed,
      _type,
    }: EntityLocationRelationship) => {
      if (entityHandler[startNodeType](startNodeId) && entityHandler[endNodeType](endNodeId)) {
        createEdge(startNodeId, endNodeId, _type, _confirmed, _type)
      }
    }

    companiesHeadquarters.forEach(entityLocationEdgeHandler)
    companiesBranches.forEach(entityLocationEdgeHandler)
    personsHomeAddress.forEach(entityLocationEdgeHandler)
    personsBirthPlace.forEach(entityLocationEdgeHandler)
    propertiesLocation.forEach(entityLocationEdgeHandler)
    eventsOccurrencePlace.forEach(entityLocationEdgeHandler)

    dagre.layout(dagreGraph, { compound: true })

    setNodes(
      Array.from(nodesMap.values()).map((node) => {
        const { x, y } = dagreGraph.node(node.id)
        return { ...node, position: { x: x - 100, y: y - 75 } }
      }),
    )

    setEdges(Array.from(edgesMap.values()))
  }, [data?.getEntitiesGraph, visibleEntities, visibleRelationships])

  return loading ? (
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
  ) : null
}
