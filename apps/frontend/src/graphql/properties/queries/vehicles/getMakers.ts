import { gql, useLazyQuery } from '@apollo/client'

type Response = {
  getMakers: string[]
}

type Params = {
  model?: string
}

const query = gql`
  query GetMakers($model: String) {
    getMakers(model: $model)
  }
`

export const getMakersRequest = () =>
  useLazyQuery<Response, Params>(query, { fetchPolicy: 'cache-first' })
