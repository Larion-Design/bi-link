import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { PersonCardActions } from '../../card/personCardActions'
import { CompanyListRecord } from '../../../types/company'

type Props = {
  companyInfo: CompanyListRecord
  removeCompany: (companyId: string) => void
}

export const PartyCompany: React.FunctionComponent<Props> = ({
  companyInfo: { _id, name, cui },
  removeCompany,
}) => (
  <Card variant={'outlined'}>
    <CardContent
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant={'body1'} sx={{ mb: 3, mt: 2 }}>
        {name}
      </Typography>
      <Typography variant={'subtitle1'}>{cui}</Typography>
    </CardContent>
    <PersonCardActions
      name={name}
      personId={_id}
      onRemove={() => removeCompany(_id)}
    />
  </Card>
)
