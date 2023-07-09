import { gql, useMutation } from '@apollo/client'

type Params = {
  cui: string
}

type Response = {
  importTermeneCompany: boolean
}

const request = gql`
  mutation ImportTermeneCompany($cui: String!) {
    importTermeneCompany(cui: $cui)
  }
`

export const importTermeneCompany = () => useMutation<Response, Params>(request)
