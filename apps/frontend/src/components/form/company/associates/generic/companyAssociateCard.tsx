import React, { useMemo } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CompanyAPIOutput, CustomFieldAPI } from 'defs'
import { useCompanyState } from '../../../../../state/company/companyState'
import { PersonCardActions } from '../../../../card/personCardActions'
import { AssociateSwitchAction } from './associateSwitchAction'
import { CompanyAssociateInformation } from './companyAssociateInformation'
import { LinkedEntityCustomFields } from '../../../linkedEntityCustomFields'

type Props = {
  associateId: string
  companyInfo: CompanyAPIOutput
  mandatoryFields?: string[]
  allowRoleChange: boolean
}

export const CompanyAssociateCard: React.FunctionComponent<Props> = ({
  associateId,
  companyInfo,
  allowRoleChange,
}) => {
  const { _id, name } = companyInfo
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
      <CardContent sx={{ opacity: isActive.value ? 1 : 0.5 }}>
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <CompanyAssociateInformation
              associateId={associateId}
              companyInfo={companyInfo}
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
      <PersonCardActions personId={_id} name={name.value} onRemove={() => removeAssociate(_id)}>
        <AssociateSwitchAction
          isActive={isActive}
          onStateChange={(isActive) => updateAssociateActive(associateId, isActive)}
        />
      </PersonCardActions>
    </Card>
  )
}
