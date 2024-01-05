import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import ApolloLinkTimeout from 'apollo-link-timeout'
import { setContext } from '@apollo/client/link/context'
import { getAccessToken } from 'utils/auth'
import { RetryLink } from '@apollo/client/link/retry'
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries'
import sha256 from 'crypto-js/sha256'

const persistedQueriesLink = createPersistedQueryLink({
  sha256: (data: string) => sha256(data).toString(),
})

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_API_URL,
  // credentials: 'include',
  useGETForQueries: false,
})

const retryLink = new RetryLink()

const authLink = setContext(async (operation, { headers }) => {
  const token = await getAccessToken()

  if (token) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }
  }
  return { headers }
})

const timeoutLink = new ApolloLinkTimeout(15000)

export const apolloClient = new ApolloClient({
  link: persistedQueriesLink.concat(
    authLink.concat(timeoutLink.concat(retryLink.concat(httpLink))),
  ),
  cache: new InMemoryCache({ addTypename: false }),
})
