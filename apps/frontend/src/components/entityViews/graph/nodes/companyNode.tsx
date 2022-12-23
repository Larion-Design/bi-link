import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import Typography from '@mui/material/Typography'
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined'
import Paper from '@mui/material/Paper'

type Props = {
  label: string
  isRootNode?: boolean
}

export const CompanyNode: React.FunctionComponent<NodeProps<Props>> = ({
  data: { label, isRootNode },
}) => (
  <>
    <Handle type={'target'} position={Position.Top} />
    <Paper
      sx={(theme) => ({
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: isRootNode
          ? theme.palette.background.paper
          : theme.palette.background.default,
      })}
    >
      <StoreOutlinedIcon fontSize={'small'} />
      <Typography sx={{ ml: 1 }} variant={'body2'}>
        {label}
      </Typography>
    </Paper>
    <Handle type={'source'} position={Position.Bottom} />
  </>
)
