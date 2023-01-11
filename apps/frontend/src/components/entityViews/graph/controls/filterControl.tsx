import { Checkbox } from '@mui/material'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useCallback, useRef, useState } from 'react'
import HubIcon from '@mui/icons-material/Hub'
import { ControlButton } from 'reactflow'
import Autocomplete from '@mui/material/Autocomplete'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { MultiSelect } from '../../../form/multiSelect'

type Props = {
  allEntities: string[]
  visibleEntities: string[]
  updateVisibleEntities: (entities: string[]) => void
  allRelationships: string[]
  visibleRelationships: string[]
  updateVisibleRelationships: (relationships: string[]) => void
}

export const FilterControl: React.FunctionComponent<Props> = ({
  allEntities,
  visibleEntities,
  updateVisibleEntities,
  allRelationships,
  visibleRelationships,
  updateVisibleRelationships,
}) => {
  const iconRef = useRef<Element | null>(null)
  const [open, setOpenState] = useState(false)

  const closePopover = useCallback(() => setOpenState(false), [setOpenState])

  return (
    <ControlButton disabled onClick={() => null}>
      <HubIcon fontSize={'small'} />
      <Popover
        open={open}
        anchorEl={iconRef.current}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <Box>
          <MultiSelect
            label={'Tipuri de entitati'}
            options={allEntities}
            checkedOptions={visibleEntities}
            onSelectedOptionsChange={updateVisibleEntities}
          />

          <MultiSelect
            label={'Tipuri de relatii'}
            options={allRelationships}
            checkedOptions={visibleRelationships}
            onSelectedOptionsChange={updateVisibleRelationships}
          />
        </Box>
      </Popover>
    </ControlButton>
  )
}
