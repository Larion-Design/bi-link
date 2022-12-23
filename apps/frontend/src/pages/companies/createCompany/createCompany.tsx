import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { createCompanyRequest } from '../../../graphql/companies/mutations/createCompany'
import { routes } from '../../../router/routes'
import { CompanyDetails } from '../../../components/page/companyDetails'

export const CreateCompany: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [createCompany, { data, loading, error }] = createCompanyRequest()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (data?.createCompany) {
      enqueueSnackbar('Compania a fost creata cu succes.', {
        variant: 'success',
        preventDuplicate: true,
      })
      navigate(routes.companies)
    }
  }, [data?.createCompany])

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza o companie'}>
      <CompanyDetails
        readonly={false}
        onSubmit={(companyInfo) => {
          if (!loading) {
            void createCompany({
              variables: {
                companyInfo,
              },
            })
          }
        }}
      />
    </DashboardPage>
  )
}
