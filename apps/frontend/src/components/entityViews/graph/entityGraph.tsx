import React, { useCallback } from 'react'
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
import { useTheme } from '@mui/material'
import Paper from '@mui/material/Paper'
import { EntityType } from 'defs'
import { DepthControl } from './controls/depthControl'
import { FilterControl } from './controls/filterControl'
import { PrintControl } from './controls/printControl'
import { PersonNode } from './nodes/personNode'
import { CompanyNode } from './nodes/companyNode'
import { PropertyNode } from './nodes/propertyNode'
import { IncidentNode } from './nodes/incidentNode'
import { NodeTypes } from './nodes/type'

type Props = {
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
}

export const EntityGraph: React.FunctionComponent<Props> = ({
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
}) => {
  const theme = useTheme()

  const onNodeClick: NodeMouseHandler = useCallback(
    (event, node) => onEntitySelected(node.id, nodeTypeToEntityType[node.type]),
    [onEntitySelected],
  )

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (event, edge) => onRelationshipSelected(edge.source, edge.target),
    [onRelationshipSelected],
  )

  return (
    <ReactFlow
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
      <Panel position={'top-left'}>
        <Paper variant={'outlined'} sx={{ p: 2 }}>
          Grafic relational
        </Paper>
      </Panel>
      <Background color={theme.palette.grey[200]} variant={BackgroundVariant.Lines} />
      <Controls>
        <PrintControl />
        <DepthControl depth={depth} updateDepth={updateDepth} />
        <FilterControl
          allEntities={allEntities}
          visibleEntities={visibleEntities}
          updateVisibleEntities={setVisibleEntities}
          allRelationships={allRelationships}
          visibleRelationships={visibleRelationships}
          updateVisibleRelationships={setVisibleRelationships}
        />
      </Controls>
      <MiniMap nodeStrokeWidth={3} zoomable pannable />
    </ReactFlow>
  )
}

const nodeTypes = {
  personNode: PersonNode,
  companyNode: CompanyNode,
  propertyNode: PropertyNode,
  incidentNode: IncidentNode,
}

const nodeTypeToEntityType: Record<NodeTypes, EntityType> = {
  personNode: 'PERSON',
  companyNode: 'COMPANY',
  propertyNode: 'PROPERTY',
  incidentNode: 'INCIDENT',
}
