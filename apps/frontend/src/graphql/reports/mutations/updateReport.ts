import { gql, useMutation } from '@apollo/client'
import { ReportAPIInput } from 'defs'

type Params = {
  reportId: string
  data: ReportAPIInput
}

type Response = {
  updateReport: boolean
}

const request = gql`
  mutation UpdateReport($reportId: String!, $data: ReportInput!) {
    updateReport(reportId: $reportId, data: $data)
  }
`

export const updateReportRequest = () => useMutation<Response, Params>(request)
