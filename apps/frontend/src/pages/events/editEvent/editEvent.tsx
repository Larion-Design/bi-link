import React, { useEffect } from 'react'
import { getEventRequest } from '../../../graphql/events/queries/getEvent'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
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
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (updateData?.updateEvent) {
      enqueueSnackbar('Eventul a fost actualizat.', {
        variant: 'success',
        preventDuplicate: true,
      })
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
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
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
            void updateEvent({
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
