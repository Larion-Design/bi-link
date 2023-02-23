import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { createEventRequest } from '../../../graphql/events/mutations/createEvent'
import { EventDetails } from '../../../components/page/eventDetails'

export const CreateEvent: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [createEvent, { data, loading, error }] = createEventRequest()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (data?.createEvent) {
      enqueueSnackbar('Evenimentul a fost creat cu succes.', {
        variant: 'success',
        preventDuplicate: true,
      })
      navigate(routes.events)
    }
  }, [data?.createEvent])

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza un event'}>
      <EventDetails
        readonly={false}
        onSubmit={(eventInfo) => {
          if (!loading) {
            void createEvent({
              variables: {
                data: eventInfo,
              },
            })
          }
        }}
      />
    </DashboardPage>
  )
}
