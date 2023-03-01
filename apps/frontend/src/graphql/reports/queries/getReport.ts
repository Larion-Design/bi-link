import { gql, useLazyQuery } from '@apollo/client'
import { ReportAPIInput } from 'defs'

type Params = {
  id: string
}

type Response = {
  getReport: ReportAPIInput
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
      event {
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
            name
            description
          }
          graph {
            label
          }
        }
      }
      refs {
        person {
          _id
        }
        company {
          _id
        }
        property {
          _id
        }
        event {
          _id
        }
        field
        path
        targetId
      }
    }
  }
`

export const getReportRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
