import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { getPersonFullName } from '@frontend/utils/person'
import { PersonCardActions } from '../../../../card/personCardActions'
import { AssociateSwitchAction } from './associateSwitchAction'
import { PersonAssociateInformation } from './personAssociateInformation'
import { AssociateAPIInput, PersonListRecordWithImage } from 'defs'
import { LinkedEntityCustomFields } from '../../../linkedEntityCustomFields'

type Props = {
  associateInfo: AssociateAPIInput
  personInfo: PersonListRecordWithImage
  removeAssociate: (personId: string) => void
  updateAssociate: (personId: string, associateInfo: AssociateAPIInput) => void
  mandatoryFields?: string[]
  allowRoleChange: boolean
}

export const PersonAssociateCard: React.FunctionComponent<Props> = ({
  associateInfo,
  personInfo,
  removeAssociate,
  updateAssociate,
  allowRoleChange,
}) => {
  const fullName = getPersonFullName(personInfo)
  const { customFields, isActive } = associateInfo
  const { _id } = personInfo

  return (
    <Card sx={{ minHeight: 300, p: 1 }} variant={'outlined'}>
      <CardContent sx={{ opacity: isActive ? 1 : 0.5 }}>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <PersonAssociateInformation
              personId={_id}
              updateAssociate={updateAssociate}
              associateInfo={associateInfo}
              personInfo={personInfo}
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
      <PersonCardActions personId={_id} name={fullName} onRemove={() => removeAssociate(_id)}>
        <AssociateSwitchAction
          isActive={isActive}
          onStateChange={(isActive) => updateAssociate(_id, { ...associateInfo, isActive })}
        />
      </PersonCardActions>
    </Card>
  )
}
