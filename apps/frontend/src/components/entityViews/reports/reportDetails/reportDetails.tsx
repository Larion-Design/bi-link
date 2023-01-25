import React, { useCallback, useEffect } from 'react'
import { EntityType, ReportAPIInput } from 'defs'
import { createReportRequest } from '../../../../graphql/reports/mutations/createReport'
import { updateReportRequest } from '../../../../graphql/reports/mutations/updateReport'
import { getReportRequest } from '../../../../graphql/reports/queries/getReport'
import { ReportForm } from '../../../form/reportForm'

type Props = {
  entityId: string
  entityType: EntityType
  reportId: string | null
  reportType?: string
  navigateToReportsList: () => void
}

export const ReportDetails: React.FunctionComponent<Props> = ({
  reportId,
  reportType,
  entityId,
  entityType,
  navigateToReportsList,
}) => {
  const [fetchReport, { data: fetchReportData }] = getReportRequest()
  const [createReport, { data: createReportData }] = createReportRequest()
  const [updateReport, { data: updateReportData }] = updateReportRequest()

  useEffect(() => {
    if (reportId) {
      void fetchReport({ variables: { id: reportId } })
    }
  }, [reportId])

  const submitFormHandler = useCallback(
    (data: ReportAPIInput) => {
      if (reportId) {
        void updateReport({ variables: { reportId, data } })
      } else {
        void createReport({ variables: { data } })
      }
    },
    [reportId, updateReport, createReport],
  )

  useEffect(() => {
    if (createReportData?.createReport && updateReportData?.updateReport) {
      navigateToReportsList()
    }
  }, [createReportData?.createReport, updateReportData?.updateReport, navigateToReportsList])

  return (
    <ReportForm
      reportId={reportId}
      reportType={reportType}
      entityId={entityId}
      entityType={entityType}
      reportInfo={fetchReportData.getReport}
      onSubmit={submitFormHandler}
      onCancel={navigateToReportsList}
    />
  )
}
