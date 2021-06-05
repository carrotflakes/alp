import '../styles/globals.css'

import { NextPage } from 'next'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import { AuthProvider } from '../context/auth'
import { MyApolloProvider } from '../context/apollo'

const MyApp: NextPage<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <MyApolloProvider>
        <Component {...pageProps} />
      </MyApolloProvider>
    </AuthProvider>
  )
}

export default MyApp
