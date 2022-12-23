import React, { PropsWithChildren } from 'react'
import { CardActions } from '@mui/material'
import { ViewPersonPage } from '../../actionButton/viewPersonPage'
import { RemovePerson } from '../../actionButton/removePerson'
import Box from '@mui/material/Box'

type Props = {
  name: string
  personId: string
  onRemove: () => void
}

export const PersonCardActions: React.FunctionComponent<
  PropsWithChildren<Props>
> = ({ personId, name, onRemove, children }) => (
  <CardActions
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Box display={'flex'}>{children}</Box>
    <Box display={'flex'}>
      <ViewPersonPage personId={personId} name={name} />
      <RemovePerson name={name} onRemove={onRemove} />
    </Box>
  </CardActions>
)
