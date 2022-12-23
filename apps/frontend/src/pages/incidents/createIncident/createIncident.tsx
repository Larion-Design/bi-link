import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { createIncidentRequest } from '../../../graphql/incidents/mutations/createIncident'
import { IncidentDetails } from '../../../components/page/incidentDetails'

export const CreateIncident: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [createIncident, { data, loading, error }] = createIncidentRequest()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (data?.createIncident) {
      enqueueSnackbar('Incidentul a fost creat cu succes.', {
        variant: 'success',
        preventDuplicate: true,
      })
      navigate(routes.incidents)
    }
  }, [data?.createIncident])

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza un incident'}>
      <IncidentDetails
        readonly={false}
        onSubmit={(incidentInfo) => {
          if (!loading) {
            void createIncident({
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
