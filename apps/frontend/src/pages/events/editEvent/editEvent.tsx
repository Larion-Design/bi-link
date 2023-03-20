import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useNotification } from '@frontend/utils/hooks/useNotification'
import { getEventRequest } from '../../../graphql/events/queries/getEvent'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { Loader } from '@frontend/components/loader'
import { updateEventRequest } from '../../../graphql/events/mutations/updateEvent'
import { EventDetails } from '../../../components/page/eventDetails'

export const EditEvent: React.FunctionComponent = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [fetchEvent, { data: fetchData, loading: fetchLoading, error: fetchError }] =
    getEventRequest()
  const [updateEvent, { data: updateData, loading: updateLoading, error: updateError }] =
    updateEventRequest()
  const showNotification = useNotification()

  useEffect(() => {
    if (updateData?.updateEvent) {
      showNotification('Evenimentul a fost actualizat.', 'success')
      navigate(routes.events)
    }
  }, [updateData?.updateEvent])

  useEffect(() => {
    if (eventId) {
      void fetchEvent({
        variables: {
          eventId,
        },
      })
    }
  }, [eventId])

  useEffect(() => {
    if (fetchError?.message || updateError?.message) {
      showNotification('ServerError', 'error')
    }
  }, [fetchError?.message, updateError?.message])

  return fetchLoading ? (
    <Loader visible={true} message={'Informatiile sunt incarcate...'} />
  ) : (
    <DashboardPage title={'Creaza un vehicul'}>
      <EventDetails
        eventId={eventId}
        eventInfo={fetchData?.getEvent}
        readonly={true}
        onSubmit={(eventInfo) => {
          if (!updateLoading) {
            void updateEvent({ variables: { data: eventInfo } })
          }
        }}
      />
    </DashboardPage>
  )
}
