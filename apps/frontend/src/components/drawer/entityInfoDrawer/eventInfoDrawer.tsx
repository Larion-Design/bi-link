import Box from '@mui/material/Box'
import { format } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import { EventAPIInput } from 'defs'
import { formatDate } from 'tools'
import { useCopyToClipboard } from 'usehooks-ts'
import { CreateDataRefHandler } from '../../../utils/hooks/useDataRefProcessor'
import { EntityInfoTable } from './entityInfoTable'

type Props = {
  eventId: string
  eventInfo: EventAPIInput
  createDataRef: CreateDataRefHandler
}

export const EventInfoDrawer: React.FunctionComponent<Props> = ({
  eventId,
  eventInfo,
  createDataRef,
}) => {
  const [_, copy] = useCopyToClipboard()

  const generalInfo = useMemo(
    () => ({
      type: eventInfo.type,
      date: eventInfo.date ? formatDate(eventInfo.date) : '',
      description: eventInfo.description,
    }),
    [eventInfo],
  )

  const locationInfo = useMemo(() => {
    return eventInfo.location
  }, [eventInfo])

  const extraInfo = useMemo(() => {
    const map = new Map<string, string>()
    eventInfo.customFields.forEach(({ fieldName, fieldValue }) => map.set(fieldName, fieldValue))
    return Object.fromEntries(map)
  }, [eventInfo.customFields])

  const copyGeneralInfo = useCallback(
    (key: string) => void copy(createDataRef({ entityType: 'EVENT', entityId: eventId }, key)),
    [eventId],
  )

  const copyCustomField = useCallback(
    (key: string) =>
      void copy(
        createDataRef({ entityType: 'EVENT', entityId: eventId }, 'fieldName', 'customFields', key),
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
