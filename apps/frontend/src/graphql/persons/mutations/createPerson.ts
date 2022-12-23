import { gql, useMutation } from '@apollo/client'
import { PersonAPIInput, PersonAPIOutput } from '../../../types/person'

type Params = {
  data: PersonAPIInput
}

type Response = {
  createPerson: PersonAPIOutput['_id']
}

const createPerson = gql`
  mutation CreatePerson($data: PersonInput!) {
    createPerson(data: $data)
  }
`

export const createPersonRequest = () => useMutation<Response, Params>(createPerson)
