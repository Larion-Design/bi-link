import Box from '@mui/material/Box'
import { format } from 'date-fns'
import React, { useMemo } from 'react'
import { IncidentAPIInput } from 'defs'
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
  const generalInfo = useMemo(
    () => ({
      type: incidentInfo.type,
      location: incidentInfo.location,
      date: incidentInfo.date ? format(new Date(incidentInfo.date), 'YYYY-mm-DD') : '',
      description: incidentInfo.description,
    }),
    [incidentInfo],
  )

  const extraInfo = useMemo(() => {
    const map = new Map<string, string>()
    incidentInfo.customFields.forEach(({ fieldName, fieldValue }) => map.set(fieldName, fieldValue))
    return Object.fromEntries(map)
  }, [incidentInfo.customFields])

  return (
    <Box sx={{ width: 1 }}>
      <EntityInfoTable label={'Informatii generale'} data={generalInfo} />
      <EntityInfoTable label={'Informatii suplimentare'} data={extraInfo} />
    </Box>
  )
}
