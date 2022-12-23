import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { DatePicker } from '../datePicker'
import { getPersonFullName } from '../../../utils/person'
import { PersonListRecordWithImage } from '../../../types/person'
import { OwnerAPIInput } from '../../../types/owner'
import { InputField } from '../inputField'

type Props = {
  personInfo: PersonListRecordWithImage
  ownerInfo: OwnerAPIInput
  updateOwner: (ownerId: string, ownerInfo: OwnerAPIInput) => void
}

export const PersonOwnerInformation: React.FunctionComponent<Props> = ({
  ownerInfo,
  personInfo,
  updateOwner,
}) => {
  const fullName = getPersonFullName(personInfo)
  const { registrationNumber, startDate, endDate } = ownerInfo
  const { _id, image } = personInfo

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 4 }}>
        <Avatar
          src={image?.url?.url ?? ''}
          alt={`${fullName}`}
          sx={{ width: 30, height: 30, mr: 1 }}
        />
        <Typography variant={'h6'}>{fullName}</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputField
            label={'Numar de înmatriculare'}
            value={registrationNumber}
            onChange={(registrationNumber) =>
              updateOwner(_id, { ...ownerInfo, registrationNumber })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            disableFuture
            label={'De la data'}
            value={startDate ?? null}
            onChange={(startDate) =>
              updateOwner(_id, { ...ownerInfo, startDate })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            disableFuture
            label={'Pana la data'}
            value={endDate ?? null}
            onChange={(endDate) =>
              updateOwner(_id, {
                ...ownerInfo,
                endDate,
              })
            }
          />
        </Grid>
      </Grid>
    </>
  )
}
