import { EntityType } from 'defs'
import React, { useEffect } from 'react'
import { getReportRequest } from '../../../../graphql/reports/queries/getReport'

type Props = {
  entityId: string
  entityType: EntityType
  reportId: string | null
}

export const ReportDetails: React.FunctionComponent<Props> = ({ reportId }) => {
  const [fetchReport, { data }] = getReportRequest()

  useEffect(() => {
    if (reportId) {
      void fetchReport({ variables: { id: reportId } })
    }
  }, [reportId])

  return null
}
