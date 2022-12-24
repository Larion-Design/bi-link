import React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { AutocompleteField } from '../../autocompleteField'
import { DatePicker } from '../../datePicker'
import { getPersonFullName } from '../../../../utils/person'
import { AssociateAPIInput, PersonListRecordWithImage } from 'defs'
import { ASSOCIATE_ROLES } from '../../../../utils/constants'
import TextField from '@mui/material/TextField'

type Props = {
  personId: string
  personInfo: PersonListRecordWithImage
  associateInfo: AssociateAPIInput
  allowRoleChange: boolean
  updateAssociate: (personId: string, associateInfo: AssociateAPIInput) => void
}

export const PersonAssociateInformation: React.FunctionComponent<Props> = ({
  associateInfo,
  personInfo,
  allowRoleChange,
  updateAssociate,
}) => {
  const fullName = getPersonFullName(personInfo)
  const { role, startDate, endDate, isActive, equity } = associateInfo
  const { _id, image } = personInfo

  return (
    <>
      <Box display={'flex'} alignItems={'center'} mt={2} mb={4}>
        <Avatar
          src={image?.url?.url ?? ''}
          alt={`${fullName}`}
          sx={{ width: 30, height: 30, mr: 1 }}
        />
        <Typography variant={'h6'}>{fullName}</Typography>
      </Box>

      <Grid container spacing={2}>
        {allowRoleChange && (
          <Grid item xs={12}>
            <AutocompleteField
              label={'Rol'}
              value={role}
              onValueChange={(value) =>
                updateAssociate(_id, {
                  ...associateInfo,
                  role: value,
                  person: {
                    _id,
                  },
                })
              }
              suggestions={ASSOCIATE_ROLES}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <DatePicker
            label={'De la data'}
            value={startDate ?? null}
            onChange={(startDate) =>
              updateAssociate(_id, {
                ...associateInfo,
                startDate: startDate ? new Date(startDate) : null,
              })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            label={'Pana la data'}
            value={endDate ?? null}
            onChange={(endDate) =>
              updateAssociate(_id, {
                ...associateInfo,
                endDate: endDate ? new Date(endDate) : null,
                isActive: endDate ? new Date(endDate) > new Date() : isActive,
              })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={'% Actiuni'}
            type={'number'}
            inputProps={{ step: 0.01 }}
            value={equity.toFixed(2)}
            onChange={({ target: { value } }) =>
              updateAssociate(_id, {
                ...associateInfo,
                equity: parseFloat(value),
              })
            }
          />
        </Grid>
      </Grid>
    </>
  )
}
