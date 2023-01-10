import { gql, useMutation } from '@apollo/client'
import { PersonAPIInput } from 'defs'

type Params = {
  personId: string
  personInfo: PersonAPIInput
}

type Response = {
  updatePerson: boolean
}

const request = gql`
  mutation UpdatePerson($personId: String!, $personInfo: PersonInput!) {
    updatePerson(personId: $personId, personInfo: $personInfo)
  }
`

export const updatePersonRequest = () => useMutation<Response, Params>(request)
