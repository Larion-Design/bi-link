import React, { useCallback, useId, useMemo } from 'react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
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
import { MultiSelect } from '../../form/multiSelect'
import { PrintControl } from './controls/printControl'
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

  const marks = useMemo(
    () => [
      { value: 1, label: 1 },
      { value: 2, label: 2 },
      { value: 3, label: 3 },
      { value: 4, label: 4 },
      { value: 5, label: 5 },
    ],
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
            {title ?? 'Grafic relational'}
          </Paper>
        </Panel>
      )}
      {!disableFilters && (
        <Panel position={'top-right'} className={'react-flow__filters'}>
          <Paper variant={'outlined'} sx={{ p: 2, width: 250 }}>
            <Box sx={{ width: 1, mb: 2 }}>
              <Typography gutterBottom>Nivel de complexitate</Typography>
              <Slider
                aria-label={'Nivel de complexitate'}
                size={'small'}
                value={depth}
                min={1}
                max={5}
                marks={marks}
                onChangeCommitted={(event, value) => updateDepth(+value)}
              />
            </Box>
            <Box sx={{ width: 1, mb: 3 }}>
              <MultiSelect
                label={'Tipuri de entitati'}
                options={allEntities.map((entityType) => ({
                  value: entityType,
                  label: entityTypeLocale[entityType],
                  selected: visibleEntities.includes(entityType),
                }))}
                onSelectedOptionsChange={setVisibleEntities}
              />
            </Box>

            <Box sx={{ width: 1 }}>
              <MultiSelect
                label={'Tipuri de relatii'}
                options={allRelationships.map((relationshipType) => ({
                  value: relationshipType,
                  label: relationshipType,
                  selected: visibleRelationships.includes(relationshipType),
                }))}
                onSelectedOptionsChange={setVisibleRelationships}
              />
            </Box>
          </Paper>
        </Panel>
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

const entityTypeLocale: Record<EntityType, string> = {
  PERSON: 'Persoane',
  COMPANY: 'Companii',
  PROPERTY: 'Proprietati',
  INCIDENT: 'Incidente',
  REPORT: 'Rapoarte',
  FILE: 'Fisiere',
}
