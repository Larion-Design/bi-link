import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined'

export const PropertyNode: React.FunctionComponent<NodeProps> = ({ data: { label } }) => {
  return (
    <>
      <Handle type={'target'} position={Position.Bottom} />
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AirportShuttleOutlinedIcon fontSize={'small'} />
        <Typography sx={{ ml: 1 }} variant={'body2'}>
          {label}
        </Typography>
      </Paper>
      <Handle type={'source'} position={Position.Top} />
    </>
  )
}
