import React from 'react'
import { ItemListInput } from '@frontend/components/form/itemListInput'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { usePropertyState } from '../../../../state/property/propertyState'
import { DatePickerWithMetadata } from '../../datePicker'
import { getPersonFullName } from '@frontend/utils/person'
import { PersonAPIOutput } from 'defs'

type Props = {
  ownerId: string
  personInfo: PersonAPIOutput
}

export const PersonOwnerInformation: React.FunctionComponent<Props> = ({ ownerId, personInfo }) => {
  const fullName = getPersonFullName(personInfo)
  const { images } = personInfo

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
      <Stack direction={'row'} spacing={1} mt={2} mb={4} alignItems={'center'}>
        <Avatar
          src={images[0]?.url?.url ?? ''}
          alt={`${fullName}`}
          sx={{ width: 30, height: 30 }}
        />
        <Typography variant={'h6'}>{fullName}</Typography>
      </Stack>

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
