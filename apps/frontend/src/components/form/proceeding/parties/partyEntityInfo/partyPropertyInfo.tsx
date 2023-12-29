import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type Props = {
  name: string
  type: string
}

export const PartyPropertyInfo: React.FunctionComponent<Props> = ({ name, type }) => (
  <Box>
    <Typography variant={'body2'}>{name}</Typography>
    <Typography variant={'caption'}>{type}</Typography>
  </Box>
)
