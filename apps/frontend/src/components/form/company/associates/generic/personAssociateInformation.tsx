import { AutocompleteFieldWithMetadata } from '@frontend/components/form/autocompleteField/autocompleteFieldWithMetadata'
import { InputNumberFieldWithMetadata } from '@frontend/components/form/inputNumberField/inputNumberFieldWithMetadata'
import React from 'react'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { useCompanyState } from '../../../../../state/companyState'
import { AutocompleteField } from '../../../autocompleteField'
import { DatePicker, DatePickerWithMetadata } from '../../../datePicker'
import { getPersonFullName } from '@frontend/utils/person'
import { AssociateAPI, PersonAPIOutput } from 'defs'
import { ASSOCIATE_ROLES } from '@frontend/utils/constants'

type Props = {
  associateId: string
  personInfo: PersonAPIOutput
  allowRoleChange: boolean
}

export const PersonAssociateInformation: React.FunctionComponent<Props> = ({
  associateId,
  personInfo,
  allowRoleChange,
}) => {
  const [
    associateInfo,
    updateAssociateRole,
    updateAssociateEquity,
    updateAssociateStartDate,
    updateAssociateEndDate,
  ] = useCompanyState(
    ({
      associates,
      updateAssociateRole,
      updateAssociateEquity,
      updateAssociateStartDate,
      updateAssociateEndDate,
    }) => [
      associates.get(associateId),
      updateAssociateRole,
      updateAssociateEquity,
      updateAssociateStartDate,
      updateAssociateEndDate,
    ],
  )

  const fullName = getPersonFullName(personInfo)
  const { role, startDate, endDate, isActive, equity } = associateInfo
  const { _id, images } = personInfo

  return (
    <>
      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Avatar
          src={images[0]?.url?.url ?? ''}
          alt={`${fullName}`}
          sx={{ width: 30, height: 30 }}
        />

        <Typography variant={'h6'}>{fullName}</Typography>
      </Stack>

      <Stack spacing={2}>
        {allowRoleChange && (
          <AutocompleteFieldWithMetadata
            label={'Rol'}
            fieldInfo={role}
            updateFieldInfo={(fieldInfo) => updateAssociateRole(associateId, fieldInfo)}
            suggestions={ASSOCIATE_ROLES}
          />
        )}

        <DatePickerWithMetadata
          label={'fromDate'}
          fieldInfo={startDate}
          updateFieldInfo={(startDate) => updateAssociateStartDate(associateId, startDate)}
        />

        <DatePickerWithMetadata
          label={'untilDate'}
          fieldInfo={endDate}
          updateFieldInfo={(endDate) => updateAssociateEndDate(associateId, endDate)}
        />

        <InputNumberFieldWithMetadata
          label={'% Actiuni'}
          inputProps={{ step: 0.01 }}
          fieldInfo={equity}
          updateFieldInfo={(fieldInfo) => updateAssociateEquity(associateId, fieldInfo)}
        />
      </Stack>
    </>
  )
}
