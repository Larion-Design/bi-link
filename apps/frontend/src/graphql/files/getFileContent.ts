import { gql, useLazyQuery } from '@apollo/client'

type Response = {
  getFileContent: string
}

type Params = {
  fileId: string
}

const request = gql`
  query GetFileContent($fileId: String!) {
    getFileContent(fileId: $fileId)
  }
`

export const getFileContentRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-and-network',
  })
