import React, { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import { EntityType } from 'defs'
import { ReportDetails } from './reportDetails/reportDetails'
import { ReportsList } from './reportsList'

type Props = {
  entityId: string
  entityType: EntityType
}

type ReportsView = 'create' | 'list' | 'edit'

export const Reports: React.FunctionComponent<Props> = ({ entityId, entityType }) => {
  const [view, setView] = useState<ReportsView>('list')
  const [reportId, setReportId] = useState<string | null>(null)
  const deps = [setView, setReportId]

  const viewReportDetails = useCallback((reportId: string) => {
    setView('edit')
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
      {['create', 'edit'].includes(view) && (
        <ReportDetails reportId={reportId} entityId={entityId} entityType={entityType} />
      )}
    </Box>
  )
}
