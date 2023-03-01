import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { Loader } from '@frontend/components/loader'
import { PropertyDetails } from '../../../components/page/propertyDetails'
import { updatePropertyRequest } from '../../../graphql/properties/mutations/updateProperty'
import { getPropertyRequest } from '../../../graphql/properties/queries/getProperty'

export const EditProperty: React.FunctionComponent = () => {
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const [fetchPropertyInfo, { data: fetchData, loading: fetchLoading, error: fetchError }] =
    getPropertyRequest()
  const [updateProperty, { data: updateData, loading: updateLoading, error: updateError }] =
    updatePropertyRequest()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (updateData?.updateProperty) {
      enqueueSnackbar('Proprietatea a fost actualizata.', {
        variant: 'success',
        preventDuplicate: true,
      })
      navigate(routes.properties)
    }
  }, [updateData?.updateProperty])

  useEffect(() => {
    if (propertyId) {
      void fetchPropertyInfo({
        variables: {
          propertyId,
        },
      })
    }
  }, [propertyId])

  useEffect(() => {
    if (fetchError?.message || updateError?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [fetchError?.message, updateError?.message])

  if (fetchLoading) {
    return <Loader visible={true} message={'Informatiile sunt incarcate...'} />
  }

  return (
    <DashboardPage title={'Creaza o proprietate'}>
      <PropertyDetails
        readonly={false}
        propertyId={propertyId}
        propertyInfo={fetchData?.getProperty}
        onSubmit={(propertyInfo) => {
          if (!updateLoading) {
            void updateProperty({
              variables: {
                data: propertyInfo,
              },
            })
          }
        }}
      />
    </DashboardPage>
  )
}
