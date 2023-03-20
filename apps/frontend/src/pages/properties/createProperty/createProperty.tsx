import React, { useEffect } from 'react'
import { useNotification } from '@frontend/utils/hooks/useNotification'
import { useNavigate } from 'react-router-dom'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { PropertyDetails } from '../../../components/page/propertyDetails'
import { createPropertyRequest } from '../../../graphql/properties/mutations/createProperty'

export const CreateProperty: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [createProperty, { data, loading, error }] = createPropertyRequest()
  const showNotification = useNotification()

  useEffect(() => {
    if (data?.createProperty) {
      showNotification('Proprietatea a fost creata cu succes.', 'success')
      navigate(routes.properties)
    }
  }, [data?.createProperty])

  useEffect(() => {
    if (error?.message) {
      showNotification('ServerError', 'error')
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
