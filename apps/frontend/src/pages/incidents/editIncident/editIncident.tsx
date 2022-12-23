import React, { useEffect } from 'react'
import { getIncidentRequest } from '../../../graphql/incidents/queries/getIncident'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { Loader } from '../../../components/loader/loader'
import { updateIncidentRequest } from '../../../graphql/incidents/mutations/updateIncident'
import { IncidentDetails } from '../../../components/page/incidentDetails'

export const EditIncident: React.FunctionComponent = () => {
  const { incidentId } = useParams()
  const navigate = useNavigate()
  const [fetchIncident, { data: fetchData, loading: fetchLoading, error: fetchError }] =
    getIncidentRequest()
  const [updateIncident, { data: updateData, loading: updateLoading, error: updateError }] =
    updateIncidentRequest()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (updateData?.updateIncident) {
      enqueueSnackbar('Incidentul a fost actualizat.', {
        variant: 'success',
        preventDuplicate: true,
      })
      navigate(routes.incidents)
    }
  }, [updateData?.updateIncident])

  useEffect(() => {
    if (incidentId) {
      void fetchIncident({
        variables: {
          incidentId,
        },
      })
    }
  }, [incidentId])

  useEffect(() => {
    if (fetchError?.message || updateError?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [fetchError?.message, updateError?.message])

  return fetchLoading ? (
    <Loader visible={true} message={'Informatiile sunt incarcate...'} />
  ) : (
    <DashboardPage title={'Creaza un vehicul'}>
      <IncidentDetails
        incidentId={incidentId}
        incidentInfo={fetchData?.getIncident}
        readonly={true}
        onSubmit={(incidentInfo) => {
          if (!updateLoading) {
            void updateIncident({
              variables: {
                data: incidentInfo,
              },
            })
          }
        }}
      />
    </DashboardPage>
  )
}
