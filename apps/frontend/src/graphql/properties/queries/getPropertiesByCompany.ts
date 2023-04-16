import { gql, useLazyQuery } from '@apollo/client'
import { PropertyListRecord } from 'defs'

type Params = {
  companyId: string
}

type Response = {
  getPropertiesByCompany: PropertyListRecord[]
}

const request = gql`
  query GetPropertiesByCompany($companyId: String!) {
    getPropertiesByCompany(companyId: $companyId) {
      _id
      name
      type
    }
  }
`

export const getPropertiesByCompanyRequest = () =>
  useLazyQuery<Response, Params>(request, { fetchPolicy: 'cache-first' })
