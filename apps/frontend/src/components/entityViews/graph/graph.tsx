import React, { PropsWithRef, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import ELK, { ElkNode } from 'elkjs'
import { useIntl } from 'react-intl'
import { ConnectionLineType, Edge, Node, Position, ReactFlowProvider } from 'reactflow'
import { relationshipsTypes } from '@frontend/components/form/person/constants'
import {
  CompanyListRecord,
  EntityLabel,
  EntityLocationRelationship,
  EntityType,
  EventListRecord,
  LocationAPIOutput,
  PersonListRecordWithImage,
  ProceedingListRecord,
  PropertyListRecord,
  ReportListRecord,
} from 'defs'
import { formatAddress } from 'tools'
import { useElementSize } from 'usehooks-ts'
import { v4 } from 'uuid'
import { getEntitiesGraphRequest } from '../../../graphql/shared/queries/getEntitiesGraph'
import { useNotification } from '../../../utils/hooks/useNotification'
import { EntityGraph } from './entityGraph'
import { Graph as GraphType } from 'defs'

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
  const [containerRef, { width, height }] = useElementSize()

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
    if (!data?.getEntitiesGraph || !width || !height) return

    const graphEngine = new ELK()

    const graphConfig: ElkNode = {
      id: id ?? v4(),
      width,
      height,
      children: [],
      edges: [],
      layoutOptions: {
        'elk.algorithm': 'radial',
        'elk.direction': 'DOWN',
        'nodePlacement.strategy': 'SIMPLE',
      },
    }

    const nodesMap = new Map<string, Node>()
    const edgesMap = new Map<string, Edge>()

    const createEdge = (
      startNodeId: string,
      endNodeId: string,
      label: string,
      _confirmed: boolean,
      type: string,
    ) => {
      const id = `${startNodeId}-${type}-${endNodeId}`
      const invertedId = `${endNodeId}-${type}-${startNodeId}`

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

        graphConfig.edges.push({
          id,
          sources: [startNodeId],
          targets: [endNodeId],
        })
      }
    }

    const createNode = (id: string, type: EntityLabel, data: any) => {
      if (!nodesMap.has(id)) {
        nodesMap.set(id, {
          id,
          targetPosition: Position.Top,
          sourcePosition: Position.Bottom,
          position: { x: 0, y: 0 },
          type,
          data,
        })

        graphConfig.children.push({
          id,
          width: 250,
          height: 250,
        })
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
        entitiesInvolvedInProceeding,
        entitiesReported,
      },
      entities: { persons, companies, properties, events, locations, reports, proceedings },
    } = data.getEntitiesGraph

    type GraphEntityInfo = GraphType['entities'][keyof GraphType['entities']][number]

    const entitiesInfo = new Map<string, GraphEntityInfo>()
    const addEntityInfo = (entityInfo: GraphEntityInfo) =>
      entitiesInfo.set(entityInfo._id, entityInfo)

    persons.forEach(addEntityInfo)
    companies.forEach(addEntityInfo)
    properties.forEach(addEntityInfo)
    events.forEach(addEntityInfo)
    proceedings.forEach(addEntityInfo)
    reports.forEach(addEntityInfo)
    locations.forEach(addEntityInfo)

    const entityHandler = {
      [EntityLabel.PERSON]: (personId: string) => {
        if (nodesMap.has(personId)) return true

        const personInfo = entitiesInfo.get(personId) as PersonListRecordWithImage

        if (personInfo) {
          graphConfig.children.push({
            id: personId,
            children: [],
            width: 250,
            height: 250,
          })

          createNode(personId, EntityLabel.PERSON, {
            label: `${personInfo.lastName} ${personInfo.firstName}`,
            image: personInfo.images?.[0]?.url.url,
            isRootNode: personId === entityId,
          })
          return true
        }
      },
      [EntityLabel.COMPANY]: (companyId: string) => {
        if (nodesMap.has(companyId)) return true

        const companyInfo = entitiesInfo.get(companyId) as CompanyListRecord

        if (companyInfo) {
          createNode(companyId, EntityLabel.COMPANY, {
            label: companyInfo.name,
            isRootNode: companyId === entityId,
          })
          return true
        }
      },
      [EntityLabel.PROPERTY]: (propertyId: string) => {
        if (nodesMap.has(propertyId)) return true

        const propertyInfo = entitiesInfo.get(propertyId) as PropertyListRecord

        if (propertyInfo) {
          createNode(propertyId, EntityLabel.PROPERTY, {
            label: propertyInfo.name,
            isRootNode: propertyId === entityId,
          })
          return true
        }
      },
      [EntityLabel.EVENT]: (eventId: string) => {
        if (nodesMap.has(eventId)) return true

        const eventInfo = entitiesInfo.get(eventId) as EventListRecord

        if (eventInfo) {
          createNode(eventId, EntityLabel.EVENT, {
            label: eventInfo.location,
            isRootNode: eventId === entityId,
          })
          return true
        }
      },
      [EntityLabel.LOCATION]: (locationId: string) => {
        if (nodesMap.has(locationId)) return true

        const locationInfo = entitiesInfo.get(locationId) as LocationAPIOutput

        if (locationInfo) {
          createNode(locationId, EntityLabel.LOCATION, {
            label: formatAddress(locationInfo),
            isRootNode: locationId === entityId,
          })
          return true
        }
      },
      [EntityLabel.PROCEEDING]: (proceedingId: string) => {
        if (nodesMap.has(proceedingId)) return true

        const proceedingInfo = entitiesInfo.get(proceedingId) as ProceedingListRecord

        if (proceedingInfo) {
          createNode(proceedingId, EntityLabel.PROCEEDING, {
            label: proceedingInfo.name,
            isRootNode: proceedingId === entityId,
          })
          return true
        }
      },
      [EntityLabel.REPORT]: (reportId: string) => {
        if (nodesMap.has(reportId)) return true

        const reportInfo = entitiesInfo.get(reportId) as ReportListRecord

        if (reportInfo) {
          createNode(reportId, EntityLabel.REPORT, {
            label: reportInfo.name,
            isRootNode: reportId === entityId,
          })
          return true
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
            relationshipsTypes[type] ?? type,
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

    entitiesReported.forEach(
      ({
        startNode: { _id: startNodeId, _type: startNodeType },
        endNode: { _id: endNodeId, _type: endNodeType },
        _confirmed,
        _type,
      }) => {
        if (entityHandler[startNodeType](startNodeId) && entityHandler[endNodeType](endNodeId)) {
          createEdge(startNodeId, endNodeId, _type, _confirmed, _type)
        }
      },
    )

    entitiesInvolvedInProceeding.forEach(
      ({
        startNode: { _id: startNodeId, _type: startNodeType },
        endNode: { _id: endNodeId, _type: endNodeType },
        _confirmed,
        _type,
        involvedAs,
      }) => {
        if (entityHandler[startNodeType](startNodeId) && entityHandler[endNodeType](endNodeId)) {
          createEdge(startNodeId, endNodeId, involvedAs, _confirmed, _type)
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

    graphEngine
      .layout(graphConfig)
      .then(({ children }) => {
        setEdges(Array.from(edgesMap.values()))
        setNodes(() =>
          children.map(({ id, x, y }) => ({ ...nodesMap.get(id), position: { x, y } })),
        )
      })
      .catch((error) => console.error(error))
  }, [data?.getEntitiesGraph, setNodes, setEdges, width, height, entityId])

  useEffect(() => {
    nodes.map(({ position }) => console.debug(position))
  }, [nodes])

  return loading || (nodes.length === 0 && edges.length === 0) ? null : (
    <Box sx={{ width: 1, height: 1 }} ref={containerRef}>
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
