import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { DatePicker } from '../datePicker'
import { OwnerAPIInput } from '../../../types/owner'
import { InputField } from '../inputField'
import { CompanyListRecord } from '../../../types/company'

type Props = {
  companyInfo: CompanyListRecord
  ownerInfo: OwnerAPIInput
  updateOwner: (ownerId: string, associateInfo: OwnerAPIInput) => void
}

export const CompanyOwnerInformation: React.FunctionComponent<Props> = ({
  ownerInfo,
  companyInfo,
  updateOwner,
}) => {
  const { _id, name } = companyInfo
  const { registrationNumber, startDate, endDate } = ownerInfo

  return (
    <>
      <Box display={'flex'} alignItems={'center'} mt={2} mb={4}>
        <Typography variant={'h6'}>{name}</Typography>
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
            label={'De la data'}
            value={startDate ?? null}
            onChange={(startDate) =>
              updateOwner(_id, { ...ownerInfo, startDate })
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
                endDate,
              })
            }
          />
        </Grid>
      </Grid>
    </>
  )
}
