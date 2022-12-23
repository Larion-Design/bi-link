import React, { PropsWithChildren } from 'react'
import { CardActions } from '@mui/material'
import { RemovePerson } from '../../actionButton/removePerson'
import Box from '@mui/material/Box'
import { ViewCompanyPage } from '../../actionButton/viewCompanyPage'

type Props = {
  name: string
  companyId: string
  onRemove: () => void
}

export const CompanyCardActions: React.FunctionComponent<
  PropsWithChildren<Props>
> = ({ companyId, name, onRemove, children }) => (
  <CardActions
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Box display={'flex'}>{children}</Box>
    <Box display={'flex'}>
      <ViewCompanyPage companyId={companyId} name={name} />
      <RemovePerson name={name} onRemove={onRemove} />
    </Box>
  </CardActions>
)
