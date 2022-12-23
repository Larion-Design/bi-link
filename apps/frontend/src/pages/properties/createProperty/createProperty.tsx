import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { PropertyDetails } from '../../../components/page/propertyDetails'
import { createPropertyRequest } from '../../../graphql/properties/mutations/createProperty'

export const CreateProperty: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [createProperty, { data, loading, error }] = createPropertyRequest()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (data?.createProperty) {
      enqueueSnackbar('Proprietatea a fost creata cu succes.', {
        variant: 'success',
        preventDuplicate: true,
      })
      navigate(routes.properties)
    }
  }, [data?.createProperty])

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza o proprietate'}>
      <PropertyDetails
        readonly={false}
        onSubmit={(propertyInfo) => {
          if (!loading) {
            void createProperty({
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
