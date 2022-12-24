import { gql, useMutation } from '@apollo/client'
import { Company, CompanyAPIInput } from 'defs'

type Params = {
  companyInfo: CompanyAPIInput
}

type Response = {
  createCompany: NonNullable<Company['_id']>
}

const createCompanyMutation = gql`
  mutation CreateCompany($companyInfo: CompanyInput!) {
    createCompany(data: $companyInfo)
  }
`

export const createCompanyRequest = () => useMutation<Response, Params>(createCompanyMutation)
