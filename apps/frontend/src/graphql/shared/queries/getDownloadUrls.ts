import { gql, useLazyQuery } from '@apollo/client'

type Response = {
  getDownloadUrls: string[]
}

type Params = {
  filesIds: string[]
}

const request = gql`
  query DownloadUrls($filesIds: [String!]!) {
    getDownloadUrls(filesIds: $filesIds)
  }
`

export const getDownloadUrlsRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })
