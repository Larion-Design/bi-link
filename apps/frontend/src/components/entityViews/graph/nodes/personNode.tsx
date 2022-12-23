import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import Typography from '@mui/material/Typography'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import Paper from '@mui/material/Paper'

export const PersonNode: React.FunctionComponent<NodeProps> = ({ data: { label, isRootNode } }) => {
  return (
    <>
      <Handle type={'target'} position={Position.Top} />
      <Paper
        sx={({ palette: { background } }) => ({
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: isRootNode ? background.default : 'primary',
        })}
      >
        <PersonOutlinedIcon fontSize={'small'} />
        <Typography sx={{ ml: 1 }} variant={'body2'}>
          {label}
        </Typography>
      </Paper>
      <Handle type={'source'} position={Position.Bottom} />
    </>
  )
}
