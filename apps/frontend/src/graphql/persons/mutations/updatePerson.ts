import { gql, useMutation } from '@apollo/client'
import { PersonAPIInput } from '../../../types/person'

type Params = {
  personId: string
  personInfo: PersonAPIInput
}

type Response = {
  updatePerson: boolean
}

const updatePerson = gql`
  mutation CreatePerson($personId: String!, $personInfo: PersonInput!) {
    updatePerson(personId: $personId, personInfo: $personInfo)
  }
`

export const updatePersonRequest = () => useMutation<Response, Params>(updatePerson)
