import React, { PropsWithChildren } from 'react'
import CardActions from '@mui/material/CardActions'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import { ViewPersonPage } from '../../actionButton/viewPersonPage'
import { RemovePerson } from '../../actionButton/removePerson'

type Props = {
  name: string
  personId: string
  onRemove: () => void
}

export const PersonCardActions: React.FunctionComponent<PropsWithChildren<Props>> = ({
  personId,
  name,
  onRemove,
  children,
}) => (
  <CardActions
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Box display={'flex'}>{children}</Box>
    <Stack direction={'row'} spacing={2}>
      <ViewPersonPage personId={personId} name={name} />
      <RemovePerson name={name} onRemove={onRemove} />
    </Stack>
  </CardActions>
)
