import React, { useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import ExpandIcon from '@mui/icons-material/Expand'
import Slider from '@mui/material/Slider'
import Popover from '@mui/material/Popover'
import { ControlButton } from 'reactflow'

type Props = {
  depth: number
  updateDepth: (depth: number) => void
}

export const DepthControl: React.FunctionComponent<Props> = ({ depth, updateDepth }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const closePopover = () => setAnchorEl(null)

  return (
    <ControlButton onClick={(event) => setAnchorEl(event.currentTarget)}>
      <ExpandIcon fontSize={'small'} />
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        sx={{ zIndex: 1000 }}
      >
        <Card variant={'outlined'} sx={{ width: 320, p: 2 }}>
          <CardHeader
            title={'Nivel de complexitate'}
            action={
              <IconButton title={'Inchide'} onClick={closePopover}>
                <CloseOutlinedIcon color={'error'} fontSize={'small'} />
              </IconButton>
            }
          />
          <CardContent>
            <Slider
              step={depth}
              min={1}
              max={5}
              valueLabelDisplay={'auto'}
              onChangeCommitted={(event, value) => updateDepth(+value)}
            />
          </CardContent>
        </Card>
      </Popover>
    </ControlButton>
  )
}
