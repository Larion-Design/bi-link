import React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { AutocompleteField } from '../../../autocompleteField'
import { DatePicker } from '../../../datePicker'
import { AssociateAPI, CompanyAPIOutput } from 'defs'
import { ASSOCIATE_ROLES } from '@frontend/utils/constants'
import TextField from '@mui/material/TextField'

type Props<T = AssociateAPI> = {
  associateInfo: T
  updateAssociate: (personId: string, associateInfo: T) => void
  companyId: string
  companyInfo: CompanyAPIOutput
  allowRoleChange: boolean
}

export const CompanyAssociateInformation: React.FunctionComponent<Props> = ({
  companyId,
  associateInfo,
  companyInfo,
  allowRoleChange,
  updateAssociate,
}) => {
  const { role, startDate, endDate, isActive, equity } = associateInfo

  return (
    <>
      <Box display={'flex'} alignItems={'center'} mt={2} mb={4}>
        <Typography variant={'h6'}>{companyInfo.name.value}</Typography>
      </Box>

      <Stack spacing={2}>
        {allowRoleChange && (
          <AutocompleteField
            label={'Rol'}
            value={role.value}
            onChange={(value) =>
              updateAssociate(companyId, {
                ...associateInfo,
                role: { ...role, value },
              })
            }
            suggestions={ASSOCIATE_ROLES}
          />
        )}

        <DatePicker
          label={'De la data'}
          value={startDate.value}
          onChange={(date) => {
            const value = date ? new Date(date) : null
            updateAssociate(companyId, {
              ...associateInfo,
              startDate: { ...startDate, value },
            })
          }}
        />

        <DatePicker
          label={'Pana la data'}
          value={endDate.value}
          onChange={(date) => {
            const value = date ? new Date(date) : null
            updateAssociate(companyId, {
              ...associateInfo,
              endDate: { ...endDate, value },
              isActive: { ...isActive, value: value ? value > new Date() : isActive.value },
            })
          }}
        />

        <TextField
          fullWidth
          label={'% Actiuni'}
          type={'number'}
          inputProps={{ step: 0.01 }}
          value={equity.value.toFixed(2)}
          onChange={({ target: { value } }) =>
            updateAssociate(companyId, {
              ...associateInfo,
              equity: { ...equity, value: parseFloat(value) },
            })
          }
        />
      </Stack>
    </>
  )
}
