import { gql, useLazyQuery } from '@apollo/client'

type Response = {
  getModels: string[]
}

type Params = {
  maker?: string
}

const query = gql`
  query GetModels($maker: String) {
    getModels(maker: $maker)
  }
`

export const getModelsRequest = () =>
  useLazyQuery<Response, Params>(query, { fetchPolicy: 'cache-first' })
