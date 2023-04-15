import React from 'react'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import { AutocompleteField } from '../../../autocompleteField'
import { DatePicker } from '../../../datePicker'
import { getPersonFullName } from '@frontend/utils/person'
import { AssociateAPI, PersonAPIOutput } from 'defs'
import { ASSOCIATE_ROLES } from '@frontend/utils/constants'

type Props<T = AssociateAPI> = {
  associateInfo: T
  updateAssociate: (personId: string, associateInfo: T) => void
  personId: string
  personInfo: PersonAPIOutput
  allowRoleChange: boolean
}

export const PersonAssociateInformation: React.FunctionComponent<Props> = ({
  associateInfo,
  personInfo,
  allowRoleChange,
  updateAssociate,
}) => {
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
          <AutocompleteField
            label={'Rol'}
            value={role.value}
            onValueChange={(value) =>
              updateAssociate(_id, {
                ...associateInfo,
                role: { ...role, value },
                person: { _id },
              })
            }
            suggestions={ASSOCIATE_ROLES}
          />
        )}

        <DatePicker
          label={'De la data'}
          value={startDate.value}
          onChange={(value) =>
            updateAssociate(_id, {
              ...associateInfo,
              startDate: { ...startDate, value: value ? new Date(value) : null },
            })
          }
        />

        <DatePicker
          label={'Pana la data'}
          value={endDate.value}
          onChange={(date) => {
            const value = date ? new Date(date) : null

            updateAssociate(_id, {
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
            updateAssociate(_id, {
              ...associateInfo,
              equity: { ...equity, value: parseFloat(value) },
            })
          }
        />
      </Stack>
    </>
  )
}
