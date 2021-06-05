import '../styles/globals.css'

import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { ApolloProvider } from '@apollo/client/react'
import { NextPage } from 'next'
import { AppProps } from 'next/dist/next-server/lib/router/router'

function createLink() {
  const httpLink = new HttpLink({
    uri: 'http://localhost:8000/'
  })
  
  if (typeof window === 'undefined') {
    return httpLink
  }

  const wsLink = new WebSocketLink({
    uri: 'ws://localhost:8000/',
    options: {
      reconnect: true
    }
  })
  
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  )
}

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  const client = new ApolloClient({
    link: createLink(),
    cache: new InMemoryCache()
  })

  return <ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>
}

export default MyApp
