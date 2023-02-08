import React, { useCallback, useId, useMemo } from 'react'
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
} from 'reactflow'
import { EntityType } from 'defs'
import { PrintControl } from './controls/printControl'
import { FilterPanel } from './filters/filterPanel'
import { PersonNode } from './nodes/personNode'
import { CompanyNode } from './nodes/companyNode'
import { PropertyNode } from './nodes/propertyNode'
import { IncidentNode } from './nodes/incidentNode'
import { NodeTypes } from './nodes/type'

type Props = {
  id?: string
  title?: string
  depth: number
  updateDepth: (depth: number) => void
  allEntities: string[]
  visibleEntities: string[]
  setVisibleEntities: (types: string[]) => void
  allRelationships: string[]
  visibleRelationships: string[]
  setVisibleRelationships: (types: string[]) => void
  data: {
    nodes: Node<unknown>[]
    edges: Edge<unknown>[]
  }
  onEntitySelected: (entityId: string, entityType: EntityType) => void
  onRelationshipSelected: (sourceEntityId: string, targetEntityId: string) => void
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
  allEntities,
  visibleEntities,
  setVisibleEntities,
  allRelationships,
  visibleRelationships,
  setVisibleRelationships,
  data: { nodes, edges },
  onEntitySelected,
  onRelationshipSelected,
  disableFilters,
  disableTitle,
  disableControls,
  disableMap,
}) => {
  const theme = useTheme()
  const graphId = id ?? useId()

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => onEntitySelected(node.id, nodeTypeToEntityType[node.type]),
    [onEntitySelected],
  )

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (event, edge) => onRelationshipSelected(edge.source, edge.target),
    [onRelationshipSelected],
  )

  const nodeTypes = useMemo(
    () => ({
      personNode: PersonNode,
      companyNode: CompanyNode,
      propertyNode: PropertyNode,
      incidentNode: IncidentNode,
    }),
    [],
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
      fitView
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
          allEntities={allEntities}
          visibleEntities={visibleEntities}
          setVisibleEntities={setVisibleEntities}
          allRelationships={allRelationships}
          visibleRelationships={visibleRelationships}
          setVisibleRelationships={setVisibleRelationships}
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

const nodeTypeToEntityType: Record<NodeTypes, EntityType> = {
  personNode: 'PERSON',
  companyNode: 'COMPANY',
  propertyNode: 'PROPERTY',
  incidentNode: 'INCIDENT',
}
