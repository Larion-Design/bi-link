import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDefaultCompany } from 'default-values'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { createCompanyRequest } from '../../../graphql/companies/mutations/createCompany'
import { routes } from '../../../router/routes'
import { CompanyDetails } from '../../../components/page/companyDetails'
import { useNotification } from '../../../utils/hooks/useNotification'

export const CreateCompany: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [createCompany, { data, loading, error }] = createCompanyRequest()
  const showNotification = useNotification()

  useEffect(() => {
    if (data?.createCompany) {
      showNotification('Compania a fost creata cu succes.', 'success')
      navigate(routes.companies)
    }
  }, [data?.createCompany])

  useEffect(() => {
    if (error?.message) {
      showNotification('ServerError', 'error')
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza o companie'}>
      <CompanyDetails
        companyInfo={getDefaultCompany()}
        onSubmit={(companyInfo) => {
          if (!loading) {
            void createCompany({ variables: { companyInfo } })
          }
        }}
      />
    </DashboardPage>
  )
}
