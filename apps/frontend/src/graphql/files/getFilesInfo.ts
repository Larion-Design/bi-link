import { gql, useLazyQuery } from '@apollo/client'
import { FileAPIOutput } from 'defs'

type Response = {
  getFilesInfo: FileAPIOutput[]
}

type Params = {
  filesIds: string[]
}

const request = gql`
  query GetFilesInfo($filesIds: [String!]!) {
    getFilesInfo(filesIds: $filesIds) {
      fileId
      name
      description
      isHidden
      mimeType
      url {
        url
      }
    }
  }
`

export const getFilesInfoRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
