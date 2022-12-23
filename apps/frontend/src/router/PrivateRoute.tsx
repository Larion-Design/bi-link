import React, { PropsWithChildren } from 'react'
import { routes } from './routes'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

export const PrivateRoute: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { user, loading, error } = useAuth()

  if (error) {
    console.error(error)
    return null
  }
  if (loading) {
    return null
  }
  return user ? <>{children}</> : <Navigate to={routes.login} />
}
