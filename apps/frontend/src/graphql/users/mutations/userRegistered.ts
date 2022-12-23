import { gql, useMutation } from '@apollo/client'

type Response = {
  userRegistered: boolean
}

const request = gql`
  mutation UserRegistered {
    userRegistered
  }
`

export const getUserRegisteredRequest = () => useMutation<Response>(request)
