import IconButton from '@mui/material/IconButton'
import React, { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import FilterListOffOutlinedIcon from '@mui/icons-material/FilterListOffOutlined'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import { EntityType } from 'defs'
import { Panel } from 'reactflow'
import { MultiSelect } from '../../../form/multiSelect'

type Props = {
  depth: number
  updateDepth: (depth: number) => void
  allEntities: string[]
  visibleEntities: string[]
  setVisibleEntities: (types: string[]) => void
  allRelationships: string[]
  visibleRelationships: string[]
  setVisibleRelationships: (types: string[]) => void
}

export const FilterPanel: React.FunctionComponent<Props> = ({
  depth,
  updateDepth,
  allEntities,
  visibleEntities,
  setVisibleEntities,
  allRelationships,
  visibleRelationships,
  setVisibleRelationships,
}) => {
  const [open, setOpen] = useState(false)
  const marks = useMemo(() => {
    const sliderValues = []
    let current = 0
    do {
      current += 1
      sliderValues.push({ value: current, label: current })
    } while (current < 10)
    return sliderValues
  }, [])

  const togglePanel = useCallback(() => setOpen((open) => !open), [])

  return open ? (
    <Panel position={'top-right'} className={'react-flow__filters'}>
      <Paper variant={'outlined'} sx={{ p: 2, width: 250 }}>
        <Box>
          <IconButton onClick={togglePanel}>
            <FilterListOffOutlinedIcon fontSize={'small'} />
          </IconButton>
        </Box>
        <Box sx={{ width: 1, mb: 2 }}>
          <Typography gutterBottom>Nivel de complexitate</Typography>
          <Slider
            aria-label={'Nivel de complexitate'}
            size={'small'}
            value={depth}
            min={1}
            max={10}
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
  ) : (
    <Panel position={'top-right'} className={'react-flow__filters'}>
      <Paper variant={'outlined'} sx={{ p: 2, width: 50 }}>
        <IconButton onClick={togglePanel}>
          <FilterListOutlinedIcon fontSize={'small'} />
        </IconButton>
      </Paper>
    </Panel>
  )
}

const entityTypeLocale: Record<EntityType, string> = {
  PERSON: 'Persoane',
  COMPANY: 'Companii',
  PROPERTY: 'Proprietati',
  INCIDENT: 'Incidente',
  REPORT: 'Rapoarte',
  FILE: 'Fisiere',
}
