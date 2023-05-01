import Box from '@mui/material/Box'
import React, { useCallback, useMemo } from 'react'
import { EventAPIInput } from 'defs'
import { formatDate } from 'tools'
import { useCopyToClipboard } from 'usehooks-ts'
import { useReportState } from '../../../state/report/reportState'
import { EntityInfoTable } from './entityInfoTable'

type Props = {
  eventId: string
  eventInfo: EventAPIInput
}

export const EventInfoDrawer: React.FunctionComponent<Props> = ({ eventId, eventInfo }) => {
  const [_, copy] = useCopyToClipboard()
  const { addDataRef } = useReportState()

  const generalInfo = useMemo(
    () => ({
      type: eventInfo.type.value,
      date: eventInfo.date.value ? formatDate(eventInfo.date.value) : '',
      description: eventInfo.description,
    }),
    [eventInfo],
  )

  const locationInfo = eventInfo?.location

  const extraInfo = useMemo(() => {
    const map = new Map<string, string>()
    eventInfo.customFields.forEach(({ fieldName, fieldValue }) => map.set(fieldName, fieldValue))
    return Object.fromEntries(map)
  }, [eventInfo.customFields])

  const copyGeneralInfo = useCallback(
    (key: string) => void copy(addDataRef({ entityType: 'EVENT', entityId: eventId }, key)),
    [eventId],
  )

  const copyCustomField = useCallback(
    (key: string) =>
      void copy(
        addDataRef({ entityType: 'EVENT', entityId: eventId }, 'fieldName', 'customFields', key),
      ),
    [eventId],
  )

  return (
    <Box sx={{ width: 1 }}>
      <EntityInfoTable
        label={'Informatii generale'}
        data={generalInfo}
        createDataRef={copyGeneralInfo}
        missingDataMessage={'Nu exista informatii.'}
      />
      <EntityInfoTable
        label={'Informatii suplimentare'}
        data={extraInfo}
        createDataRef={copyCustomField}
        missingDataMessage={'Nu exista informatii.'}
      />
    </Box>
  )
}
