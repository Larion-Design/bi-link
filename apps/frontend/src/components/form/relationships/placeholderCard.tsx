import { Card, CardActions, CardContent, Skeleton } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'

export const PlaceholderCard: React.FunctionComponent = () => (
  <Card>
    <CardContent>
      <Skeleton variant={'circular'} width={75} height={75} />

      <Typography variant={'body2'}>
        <Skeleton variant={'text'}></Skeleton>
      </Typography>

      <Skeleton variant={'rectangular'}></Skeleton>
      <Skeleton variant={'rectangular'}></Skeleton>
    </CardContent>
    <CardActions>
      <Skeleton variant={'rectangular'}></Skeleton>
    </CardActions>
  </Card>
)
