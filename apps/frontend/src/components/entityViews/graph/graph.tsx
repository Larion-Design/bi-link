import React, { PropsWithRef, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import dagre, { Label } from 'dagre'
import { useIntl } from 'react-intl'
import { ConnectionLineType, Edge, Node, Position, ReactFlowProvider } from 'reactflow'
import { relationshipsTypes } from '@frontend/components/form/person/constants'
import { getLocationAddress } from '@frontend/utils/location'
import { EntityLabel, EntityLocationRelationship, EntityType } from 'defs'
import { getEntitiesGraphRequest } from '../../../graphql/shared/queries/getEntitiesGraph'
import { useNotification } from '../../../utils/hooks/useNotification'
import { EntityGraph } from './entityGraph'

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
  const { formatMessage } = useIntl()
  const showNotification = useNotification()
  const [fetchGraph, { data, error, loading }] = getEntitiesGraphRequest()
  const [graphDepth, updateDepth] = useState(depth ?? 2)

  const [nodes, setNodes] = useState<Node<unknown>[]>([])
  const [edges, setEdges] = useState<Edge<unknown>[]>([])

  useEffect(() => {
    void fetchGraph({ variables: { id: entityId, depth: graphDepth } })
    setNodes([])
    setEdges([])
  }, [graphDepth, entityId])

  useEffect(() => {
    if (error?.message) {
      showNotification('ServerError', 'error')
    }
  }, [error?.message])

  useEffect(() => {
    if (!data?.getEntitiesGraph) return

    const dagreGraph = new dagre.graphlib.Graph({ directed: true, compound: true })
    dagreGraph.setDefaultEdgeLabel(() => ({}))
    dagreGraph.setGraph({ rankdir: 'TB' })

    const nodesMap = new Map<string, Node>()
    const edgesMap = new Map<string, Edge>()

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
        propertiesRelationships,
        propertiesLocation,
        personalRelationships,
        personsBirthPlace,
        personsHomeAddress,
        eventsOccurrencePlace,
        eventsParties,
      },
      entities: { persons, companies, properties, events, locations },
    } = data.getEntitiesGraph

    const entityHandler = {
      [EntityLabel.PERSON]: (personId: string) => {
        if (nodesMap.has(personId)) return true

        const personInfo = persons.find(({ _id }) => personId === _id)

        if (personInfo) {
          dagreGraph.setNode(personId, nodeConfig)

          nodesMap.set(personId, {
            id: personId,
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            hidden: false,
            position: {
              x: 0,
              y: 0,
            },
            type: EntityLabel.PERSON,
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
        if (nodesMap.has(companyId)) return true

        const companyInfo = companies.find(({ _id }) => companyId === _id)

        if (companyInfo) {
          dagreGraph.setNode(companyId, nodeConfig)

          nodesMap.set(companyId, {
            id: companyId,
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            hidden: false,
            position: {
              x: 0,
              y: 0,
            },
            type: EntityLabel.COMPANY,
            data: {
              label: companyInfo.name,
              isRootNode: companyId === entityId,
            },
          })
          return true
        }
      },
      [EntityLabel.PROPERTY]: (propertyId: string) => {
        if (nodesMap.has(propertyId)) return true

        const propertyInfo = properties.find(({ _id }) => propertyId === _id)

        if (propertyInfo) {
          dagreGraph.setNode(propertyId, nodeConfig)

          nodesMap.set(propertyId, {
            id: propertyId,
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            hidden: false,
            position: {
              x: 0,
              y: 0,
            },
            type: EntityLabel.PROPERTY,
            data: {
              label: propertyInfo.name,
              isRootNode: propertyId === entityId,
            },
          })
          return true
        }
      },
      [EntityLabel.EVENT]: (eventId: string) => {
        if (nodesMap.has(eventId)) return true

        dagreGraph.setNode(eventId, nodeConfig)

        const eventInfo = events.find(({ _id }) => eventId === _id)

        if (eventInfo) {
          nodesMap.set(eventId, {
            id: eventId,
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            hidden: false,
            position: {
              x: 0,
              y: 0,
            },
            type: EntityLabel.EVENT,
            data: {
              label: eventInfo.location,
              isRootNode: eventId === entityId,
            },
          })
        }
      },
      [EntityLabel.LOCATION]: (locationId: string) => {
        if (nodesMap.has(locationId)) return true

        dagreGraph.setNode(locationId, nodeConfig)

        const locationInfo = locations.find(({ _id }) => locationId === _id)

        if (locationInfo) {
          nodesMap.set(locationId, {
            id: locationId,
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
            hidden: false,
            position: {
              x: 0,
              y: 0,
            },
            type: EntityLabel.LOCATION,
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
          createEdge(
            startNodeId,
            endNodeId,
            formatMessage({ id: _type, defaultMessage: _type }),
            _confirmed,
            _type,
          )
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
  }, [data?.getEntitiesGraph])

  return loading ? null : (
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
          disableFilters={disableFilters}
          disableTitle={disableTitle}
          disableMap={disableMap}
          disableControls={disableControls}
        />
      </ReactFlowProvider>
    </Box>
  )
}
