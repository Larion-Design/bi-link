import { gql, useLazyQuery } from '@apollo/client'
import { FileAPIOutput } from 'defs'

type Response = {
  getFileInfo: FileAPIOutput
}

type Params = {
  fileId: string
}

const request = gql`
  query GetFileInfo($fileId: ID!) {
    getFileInfo(fileId: $fileId) {
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

export const getFileInfoRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
