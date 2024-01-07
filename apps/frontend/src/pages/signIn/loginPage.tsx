import React from 'react'
import { Helmet } from 'react-helmet'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import { LoginForm } from '../../components/form/loginForm'
import { Navigate } from 'react-router-dom'
import { routes } from '../../router/routes'
import { useAuth } from '../../utils/auth'
import { Loader } from '@frontend/components/loader'

export const LoginPage: React.FunctionComponent = () => {
  const { user, login, loading, error } = useAuth()

  if (loading) {
    return <Loader visible={loading} message={'Sesiunea este creata...'} />
  }
  if (user?.uid) {
    return <Navigate to={routes.index} replace />
  }
  return (
    <Container maxWidth={'xs'}>
      <Helmet title={'Sign in'} />
      <CssBaseline />
      <LoginForm
        disabled={loading}
        error={error?.message}
        onSubmit={({ email, password }) => login(email, password)}
      />
    </Container>
  )
}
