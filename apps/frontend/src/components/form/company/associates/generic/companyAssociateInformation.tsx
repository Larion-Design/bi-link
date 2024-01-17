import React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CompanyAPIOutput } from 'defs'
import { useCompanyState } from 'state/company/companyState'
import { DatePickerWithMetadata } from '../../../datePicker'
import { ASSOCIATE_ROLES } from '@frontend/utils/constants'
import { AutocompleteFieldWithMetadata } from '@frontend/components/form/autocompleteField/autocompleteFieldWithMetadata'
import { InputNumberFieldWithMetadata } from '@frontend/components/form/inputNumberField/inputNumberFieldWithMetadata'

type Props = {
  associateId: string
  companyInfo: CompanyAPIOutput
  allowRoleChange: boolean
}

export const CompanyAssociateInformation: React.FunctionComponent<Props> = ({
  associateId,
  companyInfo,
  allowRoleChange,
}) => {
  const [
    associateInfo,
    updateAssociateRole,
    updateAssociateStartDate,
    updateAssociateEndDate,
    updateAssociateEquity,
  ] = useCompanyState(
    ({
      associates,
      updateAssociateRole,
      updateAssociateStartDate,
      updateAssociateEndDate,
      updateAssociateEquity,
    }) => [
      associates.get(associateId),
      updateAssociateRole,
      updateAssociateStartDate,
      updateAssociateEndDate,
      updateAssociateEquity,
    ],
  )
  const { role, startDate, endDate, equity } = associateInfo

  return (
    <>
      <Box display={'flex'} alignItems={'center'} mt={2} mb={4}>
        <Typography variant={'h6'}>{companyInfo.name.value}</Typography>
      </Box>

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
