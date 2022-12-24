import { gql, useQuery } from '@apollo/client'
import { UserAPI } from 'defs'

type Response = {
  getUsers: UserAPI[]
}

const request = gql`
  query GetUsers {
    getUsers {
      _id
      name
      role
      active
      email
    }
  }
`

export const getUsersRequest = () =>
  useQuery<Response>(request, { fetchPolicy: 'cache-and-network' })
