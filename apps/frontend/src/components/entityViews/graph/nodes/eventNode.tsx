import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import WheelchairPickupOutlinedIcon from '@mui/icons-material/WheelchairPickupOutlined'

export const EventNode: React.FunctionComponent<NodeProps> = ({ data: { label } }) => {
  return (
    <>
      <Handle type={'target'} position={Position.Top} />
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <WheelchairPickupOutlinedIcon fontSize={'small'} />
        <Typography sx={{ ml: 1 }} variant={'body2'}>
          {label}
        </Typography>
      </Paper>
      <Handle type={'source'} position={Position.Bottom} />
    </>
  )
}
