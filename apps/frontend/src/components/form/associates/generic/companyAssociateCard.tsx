import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { PersonCardActions } from '../../../card/personCardActions'
import { AssociateSwitchAction } from './associateSwitchAction'
import { CompanyAssociateInformation } from './companyAssociateInformation'
import { AssociateAPIInput } from '../../../../types/associate'
import { CompanyListRecord } from '../../../../types/company'
import { LinkedEntityCustomFields } from '../../linkedEntityCustomFields'

type Props = {
  associateInfo: AssociateAPIInput
  companyInfo: CompanyListRecord
  removeAssociate: (companyId: string) => void
  updateAssociate: (companyId: string, associateInfo: AssociateAPIInput) => void
  mandatoryFields?: string[]
  allowRoleChange: boolean
}

export const CompanyAssociateCard: React.FunctionComponent<Props> = ({
  associateInfo,
  companyInfo,
  removeAssociate,
  updateAssociate,
  allowRoleChange,
}) => {
  const { _id, name } = companyInfo
  const { customFields, isActive } = associateInfo

  return (
    <Card sx={{ minHeight: 300, p: 1 }} variant={'outlined'}>
      <CardContent sx={{ opacity: isActive ? 1 : 0.5 }}>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <CompanyAssociateInformation
              companyId={_id}
              updateAssociate={updateAssociate}
              associateInfo={associateInfo}
              companyInfo={companyInfo}
              allowRoleChange={allowRoleChange}
            />
          </Grid>
          <Grid item xs={7} container>
            <LinkedEntityCustomFields
              customFields={customFields}
              updateCustomFields={(customFields) =>
                updateAssociate(_id, { ...associateInfo, customFields })
              }
            />
          </Grid>
        </Grid>
      </CardContent>
      <PersonCardActions
        personId={_id}
        name={name}
        onRemove={() => removeAssociate(_id)}
      >
        <AssociateSwitchAction
          isActive={isActive}
          onStateChange={(isActive) =>
            updateAssociate(_id, { ...associateInfo, isActive })
          }
        />
      </PersonCardActions>
    </Card>
  )
}
