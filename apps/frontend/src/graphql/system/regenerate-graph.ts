import { gql, useMutation } from '@apollo/client'

type Response = {
  regenerateGraph: boolean
}

const request = gql`
  mutation RegenerateGraph {
    regenerateGraph
  }
`

export const useRegenerateGraph = () => useMutation<Response>(request)
