import { ProceedingNode } from '@frontend/components/entityViews/graph/nodes/proceedingNode'
import { ReportNode } from '@frontend/components/entityViews/graph/nodes/reportNode'
import React, { FunctionComponent, useCallback, useId, useState } from 'react'
import { LocationNode } from '@frontend/components/entityViews/graph/nodes/locationNode'
import { useTheme } from '@mui/material'
import Paper from '@mui/material/Paper'
import 'reactflow/dist/style.css'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeMouseHandler,
  MiniMap,
  Node,
  NodeMouseHandler,
  Panel,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import { EntityType } from 'defs'
import { PrintControl } from './controls/printControl'
import { FilterPanel } from './filters/filterPanel'
import { PersonNode } from './nodes/personNode'
import { CompanyNode } from './nodes/companyNode'
import { PropertyNode } from './nodes/propertyNode'
import { EventNode } from './nodes/eventNode'
import { nodeTypeToEntityType } from './nodes/type'

type Props = {
  id?: string
  title?: string
  depth: number
  updateDepth: (depth: number) => void
  data: {
    nodes: Node<unknown>[]
    edges: Edge<unknown>[]
  }
  onEntitySelected?: (entityId: string, entityType: EntityType) => void
  onRelationshipSelected?: (sourceEntityId: string, targetEntityId: string) => void
  disableFilters?: boolean
  disableMap?: boolean
  disableControls?: boolean
  disableTitle?: boolean
}

export const EntityGraph: React.FunctionComponent<Props> = ({
  id,
  title,
  depth,
  updateDepth,
  data: { nodes: initialNodes, edges: initialEdges },
  onEntitySelected,
  onRelationshipSelected,
  disableFilters,
  disableTitle,
  disableControls,
  disableMap,
}) => {
  const theme = useTheme()
  const graphId = id ?? useId()

  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, setEdges] = useEdgesState(initialEdges)

  const [entitiesTypes, setEntitiesTypes] = useState(() => {
    const map = new Map<string, boolean>()
    nodes.forEach(({ type }) => map.set(type, true))
    return map
  })

  const [relationshipsTypes, setRelationshipsTypes] = useState(() => {
    const map = new Map<string, boolean>()
    edges.forEach(({ type }) => map.set(type, true))
    return map
  })

  const filterUpdated = useCallback(
    (entitiesTypes: Map<string, boolean>, relationshipsTypes: Map<string, boolean>) => {
      const hiddenEntities = new Set<string>()

      setEdges((edges) =>
        edges.map((edge) => {
          const { source, target } = edge
          const hidden = !relationshipsTypes.get(edge.type)

          if (hidden) {
            if (source !== id) {
              hiddenEntities.add(source)
            }
            if (target !== id) {
              hiddenEntities.add(target)
            }
          } else {
            hiddenEntities.delete(source)
            hiddenEntities.delete(target)
          }
          return {
            ...edge,
            hidden: hidden || hiddenEntities.has(source) || hiddenEntities.has(target),
          }
        }),
      )

      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          hidden: !entitiesTypes.get(node.type) || hiddenEntities.has(node.id),
        })),
      )

      setEntitiesTypes(entitiesTypes)
      setRelationshipsTypes(relationshipsTypes)
    },
    [setEdges, setNodes, setEntitiesTypes, setRelationshipsTypes],
  )

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => onEntitySelected?.(node.id, nodeTypeToEntityType[node.type]),
    [onEntitySelected],
  )

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (event, edge) => onRelationshipSelected?.(edge.source, edge.target),
    [onRelationshipSelected],
  )

  return (
    <ReactFlow
      id={graphId}
      nodes={nodes}
      edges={edges}
      defaultNodes={nodes}
      defaultEdges={edges}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      nodesDraggable
      nodesFocusable
      proOptions={{ hideAttribution: true }}
      nodeTypes={nodeTypes}
    >
      {!disableTitle && (
        <Panel position={'top-left'} className={'react-flow__title'}>
          <Paper variant={'outlined'} sx={{ p: 2 }}>
            {title?.length ? title : 'Grafic relational'}
          </Paper>
        </Panel>
      )}
      {!disableFilters && (
        <FilterPanel
          depth={depth}
          updateDepth={updateDepth}
          relationshipsTypes={relationshipsTypes}
          entitiesTypes={entitiesTypes}
          filterUpdated={filterUpdated}
        />
      )}
      <Background color={theme.palette.grey[200]} variant={BackgroundVariant.Lines} />
      {!disableControls && (
        <Controls>
          <PrintControl graphId={graphId} />
        </Controls>
      )}

      {!disableMap && <MiniMap nodeStrokeWidth={3} zoomable pannable />}
    </ReactFlow>
  )
}

const nodeTypes: Record<Partial<EntityType>, FunctionComponent> = {
  PERSON: PersonNode,
  COMPANY: CompanyNode,
  PROPERTY: PropertyNode,
  EVENT: EventNode,
  LOCATION: LocationNode,
  FILE: undefined,
  PROCEEDING: ProceedingNode,
  REPORT: ReportNode,
}
