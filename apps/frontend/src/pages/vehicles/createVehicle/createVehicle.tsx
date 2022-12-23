import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { createVehicleRequest } from '../../../graphql/vehicles/mutations/createVehicle'
import { VehicleDetails } from '../../../components/page/vehicleDetails'

export const CreateVehicle: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [createVehicle, { data, loading, error }] = createVehicleRequest()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (data?.createVehicle) {
      enqueueSnackbar('Vehiculul a fost creat cu succes.', {
        variant: 'success',
        preventDuplicate: true,
      })
      navigate(routes.vehicles)
    }
  }, [data?.createVehicle])

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza un vehicul'}>
      <VehicleDetails
        readonly={false}
        onSubmit={(vehicleInfo) => {
          if (!loading) {
            void createVehicle({
              variables: {
                data: vehicleInfo,
              },
            })
          }
        }}
      />
    </DashboardPage>
  )
}
