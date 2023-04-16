import React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useIntl } from 'react-intl'
import { DatePicker } from '../../datePicker'
import { CompanyAPIOutput, PropertyOwnerAPI } from 'defs'
import { ItemListInput } from '../../itemListInput'

type Props<T = PropertyOwnerAPI> = {
  ownerInfo: T
  updateOwner: (ownerId: string, ownerInfo: T) => void
  companyInfo: CompanyAPIOutput
}

export const CompanyOwnerInformation: React.FunctionComponent<Props> = ({
  ownerInfo,
  companyInfo,
  updateOwner,
}) => {
  const { formatMessage } = useIntl()
  const {
    _id,
    name: { value: companyName },
  } = companyInfo
  const { vehicleOwnerInfo, startDate, endDate } = ownerInfo

  return (
    <>
      <Box display={'flex'} alignItems={'center'} mt={2} mb={4}>
        <Typography variant={'h6'}>{companyName}</Typography>
      </Box>

      <Stack spacing={2}>
        {!!vehicleOwnerInfo && (
          <ItemListInput
            items={vehicleOwnerInfo.plateNumbers}
            label={'Numere de inmatriculare'}
            onChange={(plateNumbers) =>
              updateOwner(_id, {
                ...ownerInfo,
                vehicleOwnerInfo: { ...vehicleOwnerInfo, plateNumbers },
              })
            }
          />
        )}

        <DatePicker
          disableFuture
          label={formatMessage({ id: 'fromDate' })}
          value={startDate.value}
          onChange={(date) => {
            const value = date ? new Date(date) : null
            updateOwner(_id, { ...ownerInfo, startDate: { ...startDate, value } })
          }}
        />

        <DatePicker
          disableFuture
          label={formatMessage({ id: 'untilDate' })}
          value={endDate.value}
          onChange={(date) => {
            const value = date ? new Date(date) : null
            updateOwner(_id, { ...ownerInfo, endDate: { ...endDate, value } })
          }}
        />
      </Stack>
    </>
  )
}
