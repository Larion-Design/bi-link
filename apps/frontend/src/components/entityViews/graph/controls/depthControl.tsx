import React, { useCallback, useEffect, useRef, useState } from 'react'
import ExpandIcon from '@mui/icons-material/Expand'
import Slider from '@mui/material/Slider'
import Popover from '@mui/material/Popover'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ControlButton } from 'reactflow'
import { useDebounce } from 'usehooks-ts'

type Props = {
  depth: number
  updateDepth: (depth: number) => void
}

export const DepthControl: React.FunctionComponent<Props> = ({ depth, updateDepth }) => {
  const [graphDepth, setDepth] = useState(depth)
  const debouncedDepthValue = useDebounce(graphDepth, 3000)
  const iconRef = useRef<Element | null>(null)
  const [open, setOpenState] = useState(false)

  useEffect(() => updateDepth(debouncedDepthValue), [debouncedDepthValue])

  const closePopover = useCallback(() => setOpenState(false), [setOpenState])

  return (
    <ControlButton onClick={() => null}>
      <ExpandIcon fontSize={'small'} ref={(ref) => (iconRef.current = ref)} />
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
          <Typography gutterBottom>Nivel de complexitate</Typography>
          <Slider
            step={depth}
            marks
            min={1}
            max={10}
            valueLabelDisplay={'on'}
            onChange={(event, value) => setDepth(+value)}
          />
        </Box>
      </Popover>
    </ControlButton>
  )
}
