import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDefaultPerson } from 'default-values'
import { DashboardPage } from 'components/page/DashboardPage'
import { createPersonRequest } from 'api/persons/mutations/createPerson'
import { routes } from '../../../router/routes'
import { PersonAPIInput } from 'defs'
import { PersonDetails } from 'components/page/personDetails'
import { useNotification } from 'utils/hooks/useNotification'

export const CreatePerson: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const showNotification = useNotification()
  const [createPerson, { data, loading, error }] = createPersonRequest()

  useEffect(() => {
    if (data?.createPerson) {
      showNotification('Persoana a fost creata cu succes.', 'success')
      navigate(routes.persons)
    }
  }, [data?.createPerson])

  useEffect(() => {
    if (error?.message) {
      showNotification('O eroare a intervenit in timpul comunicarii cu serverul.', 'error')
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza o persoana'}>
      <PersonDetails
        personInfo={getDefaultPerson()}
        onSubmit={(data: PersonAPIInput) => {
          if (!loading) {
            void createPerson({ variables: { data } })
          }
        }}
      />
    </DashboardPage>
  )
}
