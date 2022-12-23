import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type Props = {
  name: string
  cui: string
}

export const PartyCompanyInfo: React.FunctionComponent<Props> = ({
  name,
  cui,
}) => (
  <Box>
    <Typography variant={'body2'}>{name}</Typography>
    <Typography variant={'caption'}>{cui}</Typography>
  </Box>
)
