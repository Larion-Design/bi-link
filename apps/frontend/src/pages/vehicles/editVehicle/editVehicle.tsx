import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { getVehicleRequest } from '../../../graphql/vehicles/queries/getVehicle'
import { updateVehicleRequest } from '../../../graphql/vehicles/mutations/updateVehicle'
import { Loader } from '../../../components/loader/loader'
import { VehicleDetails } from '../../../components/page/vehicleDetails'

export const EditVehicle: React.FunctionComponent = () => {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const [fetchVehicleInfo, { data: fetchData, loading: fetchLoading, error: fetchError }] =
    getVehicleRequest()
  const [updateVehicle, { data: updateData, loading: updateLoading, error: updateError }] =
    updateVehicleRequest()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (fetchData?.getVehicle) {
      enqueueSnackbar('Vehiculul a fost creat cu succes.', {
        variant: 'success',
        preventDuplicate: true,
      })
      navigate(routes.vehicles)
    }
  }, [fetchData?.getVehicle])

  useEffect(() => {
    if (vehicleId) {
      void fetchVehicleInfo({
        variables: {
          vehicleId,
        },
      })
    }
  }, [vehicleId])

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
    <DashboardPage title={'Creaza un vehicul'}>
      <VehicleDetails
        readonly={true}
        vehicleId={vehicleId}
        vehicleInfo={fetchData?.getVehicle}
        onSubmit={(vehicleInfo) => {
          if (!updateLoading) {
            void updateVehicle({
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
