import React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { usePropertyState } from '../../../../state/property/propertyState'
import { DatePickerWithMetadata } from '../../datePicker'
import { CompanyAPIOutput } from 'defs'
import { ItemListInput } from '../../itemListInput'

type Props = {
  ownerId: string
  companyInfo: CompanyAPIOutput
}

export const CompanyOwnerInformation: React.FunctionComponent<Props> = ({
  ownerId,
  companyInfo,
}) => {
  const {
    name: { value: companyName },
  } = companyInfo

  const {
    owners,
    updateOwnerStartDate,
    updateOwnerEndDate,
    setVehicleOwnerPlateNumbers,
    vehicleInfo,
  } = usePropertyState()

  const { startDate, endDate, vehicleOwnerInfo } = owners.get(ownerId)

  return (
    <>
      <Box display={'flex'} alignItems={'center'} mt={2} mb={4}>
        <Typography variant={'h6'}>{companyName}</Typography>
      </Box>

      <Stack spacing={2}>
        {!!vehicleInfo && !!vehicleOwnerInfo?.plateNumbers && (
          <ItemListInput
            items={vehicleOwnerInfo.plateNumbers}
            label={'Numere de inmatriculare'}
            onChange={(plateNumbers) => setVehicleOwnerPlateNumbers(ownerId, plateNumbers)}
          />
        )}

        <DatePickerWithMetadata
          label={'fromDate'}
          fieldInfo={startDate}
          updateFieldInfo={(startDate) => updateOwnerStartDate(ownerId, startDate)}
        />

        <DatePickerWithMetadata
          label={'untilDate'}
          fieldInfo={endDate}
          updateFieldInfo={(endDate) => updateOwnerEndDate(ownerId, endDate)}
        />
      </Stack>
    </>
  )
}
