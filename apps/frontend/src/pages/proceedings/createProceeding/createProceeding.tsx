import { DashboardPage } from '@frontend/components/page/DashboardPage'
import { EventDetails } from '@frontend/components/page/eventDetails'
import { ProceedingDetails } from '@frontend/components/page/proceedingDetails'
import { createEventRequest } from '@frontend/graphql/events/mutations/createEvent'
import { createProceedingRequest } from '@frontend/graphql/proceedings/mutations/createProceeding'
import { useNotification } from '@frontend/utils/hooks/useNotification'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { routes } from '../../../router/routes'

export const CreateProceeding: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [createProceeding, { data, loading, error }] = createProceedingRequest()
  const showNotification = useNotification()

  useEffect(() => {
    if (data?.createProceeding) {
      showNotification('Evenimentul a fost creat cu succes.', 'success')
      navigate(routes.events)
    }
  }, [data?.createProceeding])

  useEffect(() => {
    if (error?.message) {
      showNotification('ServerError', 'error')
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza un eveniment'}>
      <ProceedingDetails
        onSubmit={(eventInfo) => {
          if (!loading) {
            void createProceeding({ variables: { data: eventInfo } })
          }
        }}
      />
    </DashboardPage>
  )
}
