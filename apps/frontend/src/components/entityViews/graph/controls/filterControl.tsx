import Box from '@mui/material/Box'
import React, { useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import HubIcon from '@mui/icons-material/Hub'
import { ControlButton } from 'reactflow'
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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const closePopover = () => setAnchorEl(null)

  return (
    <ControlButton onClick={(event) => setAnchorEl(event.currentTarget)}>
      <HubIcon fontSize={'small'} />
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <Card variant={'outlined'}>
          <CardHeader
            title={'Filtre'}
            action={
              <IconButton title={'Inchide'} onClick={closePopover}>
                <CloseOutlinedIcon color={'error'} fontSize={'small'} />
              </IconButton>
            }
          />
          <CardContent>
            <Box sx={{ width: 1, mb: 3 }}>
              <MultiSelect
                label={'Tipuri de entitati'}
                options={allEntities}
                checkedOptions={visibleEntities}
                onSelectedOptionsChange={updateVisibleEntities}
              />
            </Box>

            <Box sx={{ width: 1 }}>
              <MultiSelect
                label={'Tipuri de relatii'}
                options={allRelationships}
                checkedOptions={visibleRelationships}
                onSelectedOptionsChange={updateVisibleRelationships}
              />
            </Box>
          </CardContent>
        </Card>
      </Popover>
    </ControlButton>
  )
}
