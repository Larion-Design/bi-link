import Box from '@mui/material/Box'
import React, { useCallback, useState } from 'react'
import { ReportDetails } from './reportDetails/reportDetails'
import { ReportsList } from './reportsList'

type Props = {
  entityId: string
  entityType: 'PERSON' | 'COMPANY' | 'PROPERTY' | 'INCIDENT'
}

type ReportsView = 'create' | 'list'

export const Reports: React.FunctionComponent<Props> = ({ entityId, entityType }) => {
  const [view, setView] = useState<ReportsView>('list')
  const [reportId, setReportId] = useState<string | null>(null)
  const deps = [setView, setReportId]

  const viewReportDetails = useCallback((reportId: string) => {
    setView('create')
    setReportId(reportId)
  }, deps)

  const createReport = useCallback(() => {
    setView('create')
    setReportId(null)
  }, deps)

  return (
    <Box sx={{ width: 1, p: 4, mt: 2 }}>
      {view === 'list' && (
        <ReportsList
          entityId={entityId}
          entityType={entityType}
          createReport={createReport}
          viewReportDetails={viewReportDetails}
        />
      )}
      {view === 'create' && <ReportDetails reportId={reportId} />}
    </Box>
  )
}
