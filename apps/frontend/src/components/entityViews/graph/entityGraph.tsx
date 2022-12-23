import React from 'react'
import 'reactflow/dist/style.css'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  Panel,
} from 'reactflow'
import { useTheme } from '@mui/material'
import Paper from '@mui/material/Paper'
import { PersonNode } from './nodes/personNode'
import { CompanyNode } from './nodes/companyNode'
import { PropertyNode } from './nodes/propertyNode'
import { IncidentNode } from './nodes/incidentNode'

type Props = {
  data: {
    nodes: Node<unknown>[]
    edges: Edge<unknown>[]
  }
  onEntitySelected: (entityInfo: unknown) => void
  onEdgeSelected: (sourceEntityId: string, targetEntityId: string) => void
}

export const EntityGraph: React.FunctionComponent<Props> = ({
  data: { nodes, edges },
  onEntitySelected,
  onEdgeSelected,
}) => {
  const theme = useTheme()

  return (
    <ReactFlow
      defaultNodes={nodes}
      defaultEdges={edges}
      onNodeClick={(event, node) => onEntitySelected(node.id)}
      onEdgeClick={(event, edge) => onEdgeSelected(edge.source, edge.target)}
      fitView
      nodesDraggable
      proOptions={{ hideAttribution: true }}
      nodeTypes={nodeTypes}
    >
      <Panel position={'top-left'}>
        <Paper variant={'outlined'} sx={{ p: 1 }}>
          Graf relational
        </Paper>
      </Panel>
      <Background
        color={theme.palette.grey[200]}
        variant={BackgroundVariant.Lines}
      />
      <Controls />
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
