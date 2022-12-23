import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { updatePersonRequest } from '../../../graphql/persons/mutations/updatePerson'
import { getPersonInfoRequest } from '../../../graphql/persons/queries/getPersonInfo'
import { routes } from '../../../router/routes'
import { Loader } from '../../../components/loader/loader'
import { PersonAPIInput } from '../../../types/person'
import { PersonDetails } from '../../../components/page/personDetails'

export const EditPerson: React.FunctionComponent = () => {
  const { personId } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [requestPersonInfo, { data: fetchData, error: fetchError, loading: fetchLoading }] =
    getPersonInfoRequest()

  const [updatePerson, { data: updateData, error: updateError, loading: updateLoading }] =
    updatePersonRequest()

  useEffect(() => {
    if (personId) {
      void requestPersonInfo({
        variables: {
          personId,
        },
      })
    }
  }, [personId])

  useEffect(() => {
    if (updateError?.message || fetchError?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [fetchError?.message, updateError?.message])

  useEffect(() => {
    if (updateData?.updatePerson) {
      enqueueSnackbar('Datele persoanei au fost actualizate cu succes.', {
        variant: 'success',
      })

      navigate(routes.persons)
    }
  }, [updateData?.updatePerson])

  return (
    <DashboardPage
      title={
        fetchLoading
          ? 'Actualizează persoana'
          : `${fetchData?.getPersonInfo?.firstName ?? ''} ${
              fetchData?.getPersonInfo?.lastName ?? ''
            }`
      }
    >
      <Loader visible={fetchLoading} message={'Se incarca datele persoanei...'} />
      {!!fetchData?.getPersonInfo && (
        <PersonDetails
          personId={personId}
          personInfo={fetchData?.getPersonInfo}
          readonly={true}
          onSubmit={(personInfo: PersonAPIInput) => {
            if (personId) {
              void updatePerson({
                variables: {
                  personId,
                  personInfo,
                },
              })
            }
          }}
        />
      )}
    </DashboardPage>
  )
}
