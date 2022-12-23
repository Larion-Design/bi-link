import React from 'react'
import { Helmet } from 'react-helmet'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import { Navigate } from 'react-router-dom'
import { routes } from '../../router/routes'
import { useAuth } from '../../utils/auth'
import { Loader } from '../../components/loader/loader'
import { SignupForm } from '../../components/form/signupForm'
import { getUserRegisteredRequest } from '../../graphql/users/mutations/userRegistered'

export const SignupPage: React.FunctionComponent = () => {
  const [userRegistered, { error: userRegisteredError, loading: completingRegistration }] =
    getUserRegisteredRequest()

  const { user, loading, signup, updateProfile, error } = useAuth()

  if (loading) {
    return <Loader visible={loading} message={'Contul este creat...'} />
  }

  if (user) {
    return <Navigate to={routes.index} replace />
  }
  return (
    <Container maxWidth={'xs'}>
      <Helmet title={'Sign in'} />
      <CssBaseline />
      <SignupForm
        disabled={loading || completingRegistration}
        error={error?.message ?? userRegisteredError?.message}
        onSubmit={async ({ email, password, name }) => {
          await signup(email, password)
          await updateProfile({
            displayName: name,
          })
          await userRegistered()
        }}
      />
    </Container>
  )
}
