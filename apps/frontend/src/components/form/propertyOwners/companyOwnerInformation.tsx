import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DatePicker } from '../datePicker'
import { CompanyListRecord, PropertyOwnerAPI } from 'defs'
import { ItemListInput } from '../itemListInput'

type Props = {
  companyInfo: CompanyListRecord
  ownerInfo: PropertyOwnerAPI
  updateOwner: (ownerId: string, ownerInfo: PropertyOwnerAPI) => void
}

export const CompanyOwnerInformation: React.FunctionComponent<Props> = ({
  ownerInfo,
  companyInfo,
  updateOwner,
}) => {
  const { _id, name } = companyInfo
  const { vehicleOwnerInfo, startDate, endDate } = ownerInfo

  return (
    <>
      <Box display={'flex'} alignItems={'center'} mt={2} mb={4}>
        <Typography variant={'h6'}>{name}</Typography>
      </Box>

      <Grid container spacing={2}>
        {!!vehicleOwnerInfo && (
          <Grid item xs={12}>
            <ItemListInput
              label={'Numere de înmatriculare'}
              items={vehicleOwnerInfo.plateNumbers}
              onChange={(plateNumbers) =>
                updateOwner(_id, {
                  ...ownerInfo,
                  vehicleOwnerInfo: { ...vehicleOwnerInfo, plateNumbers },
                })
              }
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <DatePicker
            label={'De la data'}
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
            label={'Pana la data'}
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
