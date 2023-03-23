import React, { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { Panel } from 'reactflow'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import FilterListOffOutlinedIcon from '@mui/icons-material/FilterListOffOutlined'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'
import { useDebounce } from 'usehooks-ts'
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
  const { formatMessage } = useIntl()
  const [open, setOpen] = useState(false)
  const togglePanel = useCallback(() => setOpen((open) => !open), [setOpen])
  const [depthValue, setDepthValue] = useState(depth)
  const debouncedDepthValue = useDebounce(depthValue, 2000)

  useEffect(() => {
    updateDepth(debouncedDepthValue)
  }, [debouncedDepthValue])

  return open ? (
    <Panel position={'top-right'} className={'react-flow__filters'}>
      <Paper variant={'outlined'} sx={{ p: 1, width: 250 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={togglePanel}>
            <FilterListOffOutlinedIcon fontSize={'small'} />
          </IconButton>
        </Box>
        <Box sx={{ width: 1, mb: 2, p: 1 }}>
          <Typography gutterBottom>Nivel de complexitate</Typography>
          <Slider
            size={'small'}
            value={depthValue}
            min={1}
            max={depthSliderSteps.length}
            marks={depthSliderSteps}
            onChangeCommitted={(event, value) => setDepthValue(+value)}
          />
        </Box>
        <Box sx={{ width: 1, mb: 3 }}>
          <MultiSelect
            label={'Tipuri de entitati'}
            disabled={!entitiesTypes.size}
            options={Array.from(entitiesTypes.entries()).map(([entityType, selected]) => ({
              value: entityType,
              label: formatMessage({ id: entityType, defaultMessage: entityType }),
              selected,
            }))}
            onSelectedOptionsChange={(options) => {
              entitiesTypes.forEach((value, key, map) => map.set(key, options.includes(key)))
              filterUpdated(entitiesTypes, relationshipsTypes)
            }}
          />
        </Box>

        <Box sx={{ width: 1 }}>
          <MultiSelect
            label={'Tipuri de relatii'}
            disabled={!relationshipsTypes.size}
            options={Array.from(relationshipsTypes.entries()).map(
              ([relationshipType, selected]) => ({
                value: relationshipType,
                label: formatMessage({
                  id: relationshipType,
                  defaultMessage: relationshipType,
                }),
                selected,
              }),
            )}
            onSelectedOptionsChange={(options) => {
              relationshipsTypes.forEach((value, key, map) => map.set(key, options.includes(key)))
              filterUpdated(entitiesTypes, relationshipsTypes)
            }}
          />
        </Box>
      </Paper>
    </Panel>
  ) : (
    <Panel position={'top-right'} className={'react-flow__filters'}>
      <Paper variant={'outlined'} sx={{ p: 1 }}>
        <IconButton onClick={togglePanel}>
          <FilterListOutlinedIcon fontSize={'small'} />
        </IconButton>
      </Paper>
    </Panel>
  )
}

const depthSliderSteps = (() => {
  const sliderValues = []
  let current = 0
  do {
    current += 1
    sliderValues.push({ value: current, label: current })
  } while (current < 10)
  return sliderValues
})()
