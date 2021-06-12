import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'

function createLink(idToken: string | undefined) {
  const httpLink = new HttpLink({
    uri: 'http://localhost:8000/'
  })

  if (typeof window === 'undefined') {
    return httpLink
  }

  const wsLink = new WebSocketLink({
    uri: 'ws://localhost:8000/',
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: { Authorization: `Bearer ${idToken}` }
    }
  })

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink,
  )
}

export const createClient = (idToken?: string) => {console.log("createClient", idToken)
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: idToken ? `Bearer ${idToken}` : "",
      }
    }
  })

  return new ApolloClient({
    link: authLink.concat(createLink(idToken)),
    cache: new InMemoryCache()
  })
}
