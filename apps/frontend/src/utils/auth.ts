import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useUpdateProfile,
} from 'react-firebase-hooks/auth'
import { useIntl } from 'react-intl'
import { Role } from 'defs'

const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
})

export const useAuth = () => {
  const { current: auth } = useRef(getAuth(firebaseApp))
  const [currentUser, loading, error] = useAuthState(auth)
  const [signInWithEmailAndPassword, authenticatedUser, loggingIn, loginError] =
    useSignInWithEmailAndPassword(auth)
  const [createUserWithEmailAndPassword, createdUser, creatingAccount, signupError] =
    useCreateUserWithEmailAndPassword(auth)

  const [updateProfile, updatingProfile, updateError] = useUpdateProfile(auth)

  const logout = useCallback(() => void auth.signOut(), [])
  const login = useCallback(
    (email: string, password: string) => void signInWithEmailAndPassword(email, password),
    [],
  )
  const signup = useCallback(
    async (email: string, password: string) => createUserWithEmailAndPassword(email, password),
    [],
  )

  const updateUserProfile = useCallback(updateProfile, [])

  return {
    user: currentUser ?? authenticatedUser?.user ?? createdUser?.user,
    loading: loading || loggingIn || creatingAccount || updatingProfile,
    error: error || loginError || signupError || updateError,
    logout,
    login,
    signup,
    updateProfile: updateUserProfile,
  }
}

const userAuth = getAuth(firebaseApp)
export const getAccessToken = async () => userAuth.currentUser?.getIdToken()

export const getUserRole = () => {
  const { user } = useAuth()
  const [role, setRole] = useState<Role | null>(null)

  const hasPrivilegedAccess = useMemo(
    () => !!role && [Role.CI, Role.DEV, Role.ADMIN].includes(role),
    [role],
  )

  const isAdmin = useMemo(() => role === Role.ADMIN, [role])

  useEffect(() => {
    void user?.getIdTokenResult().then(({ claims }) => setRole((claims?.role as Role) ?? null))
  }, [user])

  return { role, hasPrivilegedAccess, isAdmin }
}

export const getUserRoleLocale = () => {
  const intl = useIntl()
  const { role } = getUserRole()
  return role ? intl.formatMessage({ id: String(role) }) : ''
}
