import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

type Props = {
  placeholder: string
}

export const PartyEntitiesPlaceholder: React.FunctionComponent<Props> = ({
  placeholder,
}) => (
  <Box sx={{ width: 1 }}>
    <Typography variant={'caption'} textAlign={'center'}>
      {placeholder}
    </Typography>
  </Box>
)
