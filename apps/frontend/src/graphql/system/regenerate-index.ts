import { gql, useMutation } from '@apollo/client'

type Response = {
  regenerateSearchIndex: boolean
}

const request = gql`
  mutation RegenerateIndex {
    regenerateSearchIndex
  }
`

export const useRegenerateIndex = () => useMutation<Response>(request)
