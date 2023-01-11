import Avatar from '@mui/material/Avatar'
import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

type Props = {
  label: string
  isRootNode: boolean
  image?: string
}

export const PersonNode: React.FunctionComponent<NodeProps<Props>> = ({
  data: { label, isRootNode, image },
}) => {
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
        <Avatar src={image} />
        <Typography sx={{ ml: 1 }} variant={'body2'}>
          {label}
        </Typography>
      </Paper>
      <Handle type={'source'} position={Position.Bottom} />
    </>
  )
}
