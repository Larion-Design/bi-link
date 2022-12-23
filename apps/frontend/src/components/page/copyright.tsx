import Typography from '@mui/material/Typography'
import React from 'react'

export const Copyright: React.FunctionComponent = () => (
  <Typography variant={'body2'} color={'text.secondary'} align={'center'}>
    {`Copyright © BI Link ${new Date().getFullYear()}.`}
  </Typography>
)
