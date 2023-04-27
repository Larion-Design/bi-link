import { gql, useLazyQuery } from '@apollo/client'
import { CompanyAPIOutput } from 'defs'
import { useMemo } from 'react'

type Params = {
  companiesIds: string[]
}

type Response = {
  getCompanies: CompanyAPIOutput[]
}

const request = gql`
  query GetCompanies($companiesIds: [ID!]!) {
    getCompanies(companiesIds: $companiesIds) {
      _id
      name {
        value
      }
      cui {
        value
      }
      registrationNumber {
        value
      }
    }
  }
`

export const getCompaniesInfoRequest = () =>
  useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })

export const getCompaniesInfoMap = () => {
  const [fetchCompanies, { loading, error, data }] = useLazyQuery<Response, Params>(request, {
    fetchPolicy: 'cache-first',
  })

  const companiesMap = useMemo(() => {
    if (data?.getCompanies) {
      const map = new Map<string, CompanyAPIOutput>()
      data?.getCompanies?.forEach((companyInfo) => map.set(companyInfo._id, companyInfo))
      return map
    }
  }, [data?.getCompanies])

  return { companiesMap, fetchCompanies, error, loading }
}
