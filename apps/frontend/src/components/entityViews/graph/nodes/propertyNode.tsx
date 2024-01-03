import { CustomNodeProps } from '@frontend/components/entityViews/graph/nodes/type'
import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined'

export const PropertyNode: React.FunctionComponent<NodeProps<CustomNodeProps>> = ({
  data: { label, isRootNode },
}) => (
  <>
    <Handle type={'target'} position={Position.Bottom} />
    <Paper
      sx={({ palette: { background } }) => ({
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: isRootNode ? background.paper : background.default,
        width: 150,
        height: 150,
      })}
    >
      <AirportShuttleOutlinedIcon fontSize={'small'} />
      <Typography sx={{ ml: 1 }} variant={'body2'}>
        {label}
      </Typography>
    </Paper>
    <Handle type={'source'} position={Position.Top} />
  </>
)
