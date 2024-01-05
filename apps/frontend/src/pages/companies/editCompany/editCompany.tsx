import React, { useEffect } from 'react'
import { DashboardPage } from 'components/page/DashboardPage'
import { useNavigate, useParams } from 'react-router-dom'
import { getCompanyInfoRequest } from 'api/companies/queries/getCompany'
import { updateCompanyRequest } from 'api/companies/mutations/updateCompany'
import { routes } from '../../../router/routes'
import { useSnackbar } from 'notistack'
import { Loader } from '@frontend/components/loader'
import { CompanyDetails } from 'components/page/companyDetails'

export const EditCompany: React.FunctionComponent = () => {
  const { companyId } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [fetchCompanyInfo, { data: fetchData, loading: fetchLoading, error: fetchError }] =
    getCompanyInfoRequest()

  const [updateCompany, { data: updateData, loading: updateLoading, error: updateError }] =
    updateCompanyRequest()

  useEffect(() => {
    if (!fetchLoading && companyId) {
      void fetchCompanyInfo({ variables: { id: companyId } })
    }
  }, [companyId])

  useEffect(() => {
    if (updateData?.updateCompany) {
      enqueueSnackbar('Datele companiei au fost actualizate cu succes.', {
        variant: 'success',
      })

      navigate(routes.companies)
    }
  }, [updateData?.updateCompany])

  useEffect(() => {
    if (updateError?.message || fetchError?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [fetchError?.message, updateError?.message])

  return (
    <DashboardPage title={'Editeaza companie'}>
      <Loader visible={fetchLoading} message={'Se incarca datele companiei...'} />
      {!!fetchData?.getCompany && (
        <CompanyDetails
          companyId={companyId}
          companyInfo={fetchData.getCompany}
          onSubmit={(companyInfo) => {
            if (!updateLoading && companyId) {
              void updateCompany({ variables: { companyId, companyInfo } })
            }
          }}
        />
      )}
    </DashboardPage>
  )
}
