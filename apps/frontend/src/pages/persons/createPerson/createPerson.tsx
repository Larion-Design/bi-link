import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { createPersonRequest } from '../../../graphql/persons/mutations/createPerson'
import { routes } from '../../../router/routes'
import { PersonAPIInput } from 'defs'
import { PersonDetails } from '../../../components/page/personDetails'

export const CreatePerson: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [createPerson, { data, loading, error }] = createPersonRequest()

  useEffect(() => {
    if (data?.createPerson) {
      enqueueSnackbar('Persoana a fost creata cu succes.', {
        variant: 'success',
      })
      navigate(routes.persons)
    }
  }, [data?.createPerson])

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Creaza o persoana'}>
      <PersonDetails
        readonly={false}
        onSubmit={(data: PersonAPIInput) => {
          if (!loading) {
            void createPerson({
              variables: {
                data,
              },
            })
          }
        }}
      />
    </DashboardPage>
  )
}
