import React, { useEffect } from 'react'
import { useNotification } from '@frontend/utils/hooks/useNotification'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardPage } from 'components/page/DashboardPage'
import { updatePersonRequest } from 'api/persons/mutations/updatePerson'
import { getPersonInfoRequest } from 'api/persons/queries/getPersonInfo'
import { routes } from '../../../router/routes'
import { Loader } from 'components/loader'
import { PersonAPIInput } from 'defs'
import { PersonDetails } from 'components/page/personDetails'
import { getPersonFullName } from 'utils/person'

export const EditPerson: React.FunctionComponent = () => {
  const { personId } = useParams()
  const navigate = useNavigate()
  const showNotification = useNotification()

  const [requestPersonInfo, { data: fetchData, error: fetchError, loading: fetchLoading }] =
    getPersonInfoRequest()

  const [updatePerson, { data: updateData, error: updateError, loading: updateLoading }] =
    updatePersonRequest()

  useEffect(() => {
    if (personId) {
      void requestPersonInfo({ variables: { personId } })
    }
  }, [personId])

  useEffect(() => {
    if (updateError?.message || fetchError?.message) {
      showNotification('Server Error', 'error')
    }
  }, [fetchError?.message, updateError?.message])

  useEffect(() => {
    if (updateData?.updatePerson) {
      showNotification('Datele persoanei au fost actualizate cu succes.', 'success')
      navigate(routes.persons)
    }
  }, [updateData?.updatePerson])

  const personName = fetchData?.getPersonInfo ? getPersonFullName(fetchData.getPersonInfo) : ''

  return (
    <DashboardPage title={personName}>
      <Loader visible={fetchLoading} message={'Se incarca datele persoanei...'} />
      {!!fetchData?.getPersonInfo && (
        <PersonDetails
          personId={personId}
          personInfo={fetchData.getPersonInfo}
          onSubmit={(personInfo: PersonAPIInput) => {
            if (personId) {
              void updatePerson({ variables: { personId, personInfo } })
            }
          }}
        />
      )}
    </DashboardPage>
  )
}
