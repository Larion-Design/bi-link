import React from 'react'
import { ItemListInput } from '@frontend/components/form/itemListInput'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { DatePicker } from '../../datePicker'
import { getPersonFullName } from '@frontend/utils/person'
import { PersonAPIOutput, PropertyOwnerAPI } from 'defs'
import { useIntl } from 'react-intl'

type Props = {
  personInfo: PersonAPIOutput
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
  const { _id, images } = personInfo

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
          label={intl.formatMessage({ id: 'fromDate' })}
          value={startDate.value}
          onChange={(date) => {
            const value = date ? new Date(date) : null
            updateOwner(_id, { ...ownerInfo, startDate: { ...startDate, value } })
          }}
        />

        <DatePicker
          disableFuture
          label={intl.formatMessage({ id: 'untilDate' })}
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
