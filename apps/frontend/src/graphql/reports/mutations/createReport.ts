import { gql, useMutation } from '@apollo/client'
import { ReportAPIOutput, ReportAPIInput } from 'defs'

type Params = {
  data: ReportAPIInput
}

type Response = {
  createReport: ReportAPIOutput['_id']
}

const request = gql`
  mutation CreateReport($reportInfo: ReportInput!) {
    createReport(data: $reportInfo)
  }
`

export const createReportRequest = () => useMutation<Response, Params>(request)
