import React, { useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { getPersonFullName } from '@frontend/utils/person'
import { useCompanyState } from '../../../../../state/companyState'
import { PersonCardActions } from '../../../../card/personCardActions'
import { AssociateSwitchAction } from './associateSwitchAction'
import { PersonAssociateInformation } from './personAssociateInformation'
import { CustomFieldAPI, PersonAPIOutput } from 'defs'
import { LinkedEntityCustomFields } from '../../../linkedEntityCustomFields'

type Props = {
  associateId: string
  personInfo: PersonAPIOutput
  mandatoryFields?: string[]
  allowRoleChange: boolean
}

export const PersonAssociateCard: React.FunctionComponent<Props> = ({
  associateId,
  personInfo,
  allowRoleChange,
}) => {
  const fullName = getPersonFullName(personInfo)
  const { _id } = personInfo

  const [
    associateInfo,
    removeAssociate,
    updateAssociateActive,
    associatesCustomFields,
    updateAssociateCustomField,
    addAssociateCustomField,
    removeAssociateCustomFields,
  ] = useCompanyState(
    ({
      associates,
      removeAssociate,
      updateAssociateActive,
      associatesCustomFields,
      updateAssociateCustomField,
      addAssociateCustomField,
      removeAssociateCustomFields,
    }) => [
      associates.get(associateId),
      removeAssociate,
      updateAssociateActive,
      associatesCustomFields,
      updateAssociateCustomField,
      addAssociateCustomField,
      removeAssociateCustomFields,
    ],
  )

  const { isActive } = associateInfo

  const customFields = useMemo(() => {
    const map = new Map<string, CustomFieldAPI>()
    associateInfo.customFields.forEach((customFieldId) =>
      map.set(customFieldId, associatesCustomFields.get(customFieldId)),
    )
    return map
  }, [associatesCustomFields, associateInfo.customFields])

  return (
    <Card sx={{ minHeight: 300, p: 1 }} variant={'outlined'}>
      <CardContent sx={{ opacity: isActive ? 1 : 0.5 }}>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <PersonAssociateInformation
              associateId={associateId}
              personInfo={personInfo}
              allowRoleChange={allowRoleChange}
            />
          </Grid>
          <Grid item xs={7} container>
            <LinkedEntityCustomFields
              customFields={customFields}
              addCustomField={() => addAssociateCustomField(associateId)}
              removeCustomFields={(ids) => removeAssociateCustomFields(associateId, ids)}
              updateCustomField={(uid, customField) => updateAssociateCustomField(uid, customField)}
            />
          </Grid>
        </Grid>
      </CardContent>
      <PersonCardActions personId={_id} name={fullName} onRemove={() => removeAssociate(_id)}>
        <AssociateSwitchAction
          isActive={isActive}
          onStateChange={(isActive) => updateAssociateActive(associateId, isActive)}
        />
      </PersonCardActions>
    </Card>
  )
}
