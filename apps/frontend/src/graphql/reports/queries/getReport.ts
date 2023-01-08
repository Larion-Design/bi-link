import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { ReportAPIOutput } from 'defs'

type EntityType = 'PERSON' | 'COMPANY' | 'PROPERTY' | 'INCIDENT'

type Params = {
  id: string
}

type Response = {
  getReports: ReportAPIOutput[]
}

const request = gql`
  query GetReport($id: String!) {
    getReport(id: $id) {
      _id
      name
      isTemplate
      company {
        _id
      }
      person {
        _id
      }
      property {
        _id
      }
      incident {
        _id
      }
      sections {
        name
        content {
          order
          link {
            label
            url
          }
          title {
            content
          }
          text {
            content
          }
          table {
            id
          }
          images {
            fileId
            isHidden
          }
          file {
            fileId
            isHidden
          }
        }
      }
    }
  }
`

export const getReportRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
