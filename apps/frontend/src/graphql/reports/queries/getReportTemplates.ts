import { gql, useQuery } from '@apollo/client'
import { ReportAPIOutput } from 'defs'

type Response = {
  getReports: ReportAPIOutput[]
}

const request = gql`
  query GetReportTemplates {
    getReportTemplates {
      _id
      name
    }
  }
`

export const getReportTemplatesRequest = () =>
  useQuery<Response>(request, { fetchPolicy: 'cache-and-network' })
