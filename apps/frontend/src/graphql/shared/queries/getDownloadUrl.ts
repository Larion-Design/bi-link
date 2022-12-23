import { gql, useLazyQuery } from '@apollo/client'

type Response = {
  getDownloadUrl: {
    url: string
  }
}

type Params = {
  objectId: string
}

const getDownloadUrl = gql`
  query DownloadUrl($objectId: String!) {
    getDownloadUrl(objectId: $objectId) {
      url
    }
  }
`

export const getDownloadUrlRequest = () => useLazyQuery<Response, Params>(getDownloadUrl)
