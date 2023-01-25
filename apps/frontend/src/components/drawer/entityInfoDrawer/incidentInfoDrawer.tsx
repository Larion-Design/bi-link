import Box from '@mui/material/Box'
import { format } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import { IncidentAPIInput } from 'defs'
import { useCopyToClipboard } from 'usehooks-ts'
import { formatDate } from '../../../utils/date'
import { CreateDataRefHandler } from '../../../utils/hooks/useDataRefProcessor'
import { EntityInfoTable } from './entityInfoTable'

type Props = {
  incidentId: string
  incidentInfo: IncidentAPIInput
  createDataRef: CreateDataRefHandler
}

export const IncidentInfoDrawer: React.FunctionComponent<Props> = ({
  incidentId,
  incidentInfo,
  createDataRef,
}) => {
  const [_, copy] = useCopyToClipboard()

  const generalInfo = useMemo(
    () => ({
      type: incidentInfo.type,
      location: incidentInfo.location,
      date: incidentInfo.date ? formatDate(incidentInfo.date) : '',
      description: incidentInfo.description,
    }),
    [incidentInfo],
  )

  const extraInfo = useMemo(() => {
    const map = new Map<string, string>()
    incidentInfo.customFields.forEach(({ fieldName, fieldValue }) => map.set(fieldName, fieldValue))
    return Object.fromEntries(map)
  }, [incidentInfo.customFields])

  const copyGeneralInfo = useCallback(
    (key: string) =>
      void copy(createDataRef({ entityType: 'INCIDENT', entityId: incidentId }, key)),
    [incidentId],
  )

  const copyCustomField = useCallback(
    (key: string) =>
      void copy(
        createDataRef(
          { entityType: 'INCIDENT', entityId: incidentId },
          'fieldName',
          'customFields',
          key,
        ),
      ),
    [incidentId],
  )

  return (
    <Box sx={{ width: 1 }}>
      <EntityInfoTable
        label={'Informatii generale'}
        data={generalInfo}
        createDataRef={copyGeneralInfo}
      />
      <EntityInfoTable
        label={'Informatii suplimentare'}
        data={extraInfo}
        createDataRef={copyCustomField}
      />
    </Box>
  )
}
