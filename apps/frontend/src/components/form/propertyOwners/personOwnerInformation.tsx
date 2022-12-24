import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { DatePicker } from '../datePicker'
import { getPersonFullName } from '../../../utils/person'
import { PersonListRecordWithImage, PropertyOwnerAPI } from 'defs'
import { InputField } from '../inputField'
import { useIntl } from 'react-intl'

type Props = {
  personInfo: PersonListRecordWithImage
  ownerInfo: PropertyOwnerAPI
  updateOwner: (ownerId: string, ownerInfo: PropertyOwnerAPI) => void
}

export const PersonOwnerInformation: React.FunctionComponent<Props> = ({
  ownerInfo,
  personInfo,
  updateOwner,
}) => {
  const intl = useIntl()
  const fullName = getPersonFullName(personInfo)
  const { vehicleOwnerInfo, startDate, endDate } = ownerInfo
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
        {!!vehicleOwnerInfo && (
          <Grid item xs={12}>
            <InputField
              label={'Numar de înmatriculare'}
              value={vehicleOwnerInfo.registrationNumber}
              onChange={(registrationNumber) =>
                updateOwner(_id, {
                  ...ownerInfo,
                  vehicleOwnerInfo: { ...vehicleOwnerInfo, registrationNumber },
                })
              }
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <DatePicker
            disableFuture
            label={intl.formatMessage({ id: 'fromDate' })}
            value={startDate ?? null}
            onChange={(startDate) =>
              updateOwner(_id, {
                ...ownerInfo,
                startDate: startDate ? new Date(startDate) : null,
              })
            }
          />
        </Grid>

        <Grid item xs={12}>
          <DatePicker
            disableFuture
            label={intl.formatMessage({ id: 'untilDate' })}
            value={endDate ?? null}
            onChange={(endDate) =>
              updateOwner(_id, {
                ...ownerInfo,
                endDate: endDate ? new Date(endDate) : null,
              })
            }
          />
        </Grid>
      </Grid>
    </>
  )
}
