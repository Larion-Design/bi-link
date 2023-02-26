import React, { useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { Panel } from 'reactflow'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import FilterListOffOutlinedIcon from '@mui/icons-material/FilterListOffOutlined'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import { MultiSelect } from '../../../form/multiSelect'

type Props = {
  depth: number
  updateDepth: (depth: number) => void
  entitiesTypes: Map<string, boolean>
  relationshipsTypes: Map<string, boolean>
  filterUpdated: (
    entitiesTypes: Map<string, boolean>,
    relationshipsTypes: Map<string, boolean>,
  ) => void
}

export const FilterPanel: React.FunctionComponent<Props> = ({
  depth,
  updateDepth,
  entitiesTypes,
  relationshipsTypes,
  filterUpdated,
}) => {
  const intl = useIntl()
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
            options={Array.from(entitiesTypes.entries()).map(([entityType, selected]) => ({
              value: entityType,
              label: intl.formatMessage({ id: entityType, defaultMessage: entityType }),
              selected,
            }))}
            onSelectedOptionsChange={(options) => {
              options.forEach((option) => entitiesTypes.set(option, true))
              filterUpdated(entitiesTypes, relationshipsTypes)
            }}
          />
        </Box>

        <Box sx={{ width: 1 }}>
          <MultiSelect
            label={'Tipuri de relatii'}
            options={Array.from(relationshipsTypes.entries()).map(
              ([relationshipType, selected]) => ({
                value: relationshipType,
                label: intl.formatMessage({
                  id: relationshipType,
                  defaultMessage: relationshipType,
                }),
                selected,
              }),
            )}
            onSelectedOptionsChange={(options) => {
              options.forEach((option) => entitiesTypes.set(option, true))
              filterUpdated(entitiesTypes, relationshipsTypes)
            }}
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
