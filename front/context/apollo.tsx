import { FC, useContext, useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client/react'
import { createClient } from '../utils/apollo'
import { AuthContext } from './auth';
import { loggedInVar } from '../vars';

export const MyApolloProvider: FC = ({ children }) => {
  const { currentUser } = useContext(AuthContext)
  const [client, setClient] = useState(() => createClient())

  useEffect(() => {
    currentUser?.getIdToken(true).then((idToken) => {
      setClient(createClient(idToken))
      loggedInVar(true)
    }).catch((e) => {
      console.error(e)
    })
  }, [currentUser])

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )
}
