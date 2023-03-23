import React from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type Props = {
  name: string
  imageUrl: string
  cnp: string
}

export const PartyPersonInfo: React.FunctionComponent<Props> = ({
  name,
  imageUrl,
  cnp,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Avatar alt={name} src={imageUrl} sx={{ width: 40, height: 40, mr: 2 }} />
    <Box>
      <Typography variant={'body2'}>{name}</Typography>
      <Typography variant={'caption'}>{cnp}</Typography>
    </Box>
  </Box>
)
