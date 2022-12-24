import { gql, useMutation } from '@apollo/client'
import { CompanyAPIInput } from 'defs'

type Params = {
  companyId: string
  companyInfo: CompanyAPIInput
}

type Response = {
  updateCompany: boolean
}

const mutation = gql`
  mutation UpdateCompany($companyId: String!, $companyInfo: CompanyInput!) {
    updateCompany(companyId: $companyId, companyInfo: $companyInfo)
  }
`

export const updateCompanyRequest = () => useMutation<Response, Params>(mutation)
