import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '@frontend/utils/hooks/useNotification'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { createEventRequest } from '../../../graphql/events/mutations/createEvent'
import { EventDetails } from '../../../components/page/eventDetails'

export const CreateEvent: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [createEvent, { data, loading, error }] = createEventRequest()
  const showNotification = useNotification()

  useEffect(() => {
    if (data?.createEvent) {
      showNotification('Evenimentul a fost creat cu succes.', 'success')
      navigate(routes.events)
    }
  }, [data?.createEvent])

  useEffect(() => {
    if (error?.message) {
      showNotification('ServerError', 'error')
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza un eveniment'}>
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
