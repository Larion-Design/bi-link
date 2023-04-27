import { gql, useLazyQuery } from '@apollo/client'
import { PersonAPIOutput } from 'defs'
import { useMemo } from 'react'

type Response = {
  getPersonsInfo: PersonAPIOutput[]
}

type Params = {
  personsIds: string[]
}

const request = gql`
  query PersonBasicInfo($personsIds: [ID!]!) {
    getPersonsInfo(personsIds: $personsIds) {
      _id
      firstName {
        value
      }
      lastName {
        value
      }
      images {
        fileId
        url {
          url
        }
      }
    }
  }
`

export const getPersonsBasicInfoRequest = () => useLazyQuery<Response, Params>(request)

export const getPersonsBasicInfoMap = () => {
  const [fetchPersons, { loading, error, data }] = getPersonsBasicInfoRequest()

  const personsMap = useMemo(() => {
    if (data?.getPersonsInfo) {
      const map = new Map<string, PersonAPIOutput>()
      data?.getPersonsInfo?.forEach((personInfo) => map.set(personInfo._id, personInfo))
      return map
    }
  }, [data?.getPersonsInfo])

  return { fetchPersons, personsMap, error, loading }
}
