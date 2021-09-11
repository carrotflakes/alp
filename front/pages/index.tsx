import firebase from 'firebase'
import Head from 'next/head'
import Link from 'next/link'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ChatView } from '../components/ChatView'
import { AuthContext } from '../context/auth'
import { useCreateUserMutation, useMeQuery, usePostMessageMutation } from "../generated/graphql"
import styles from '../styles/Home.module.css'

export default function Home() {
  const { currentUser } = useContext(AuthContext)

  const meRes = useMeQuery()
  const [createUser] = useCreateUserMutation({
    onCompleted: () => {
      meRes.refetch()
    },
  })

  const [postMessage] = usePostMessageMutation()

  const [inputText, setInputText] = useState("")

  const post = useCallback(() => {
    if (meRes.data) {
      postMessage({
        variables: { text: inputText },
        optimisticResponse: {
          postMessage: {
            id: 'temp-id',
            __typename: 'Message',
            text: inputText,
            createdAt: '',
            user: meRes.data.me
          }
        }
      })
      setInputText("")
    }
  }, [inputText, postMessage])

  useEffect(() => {
    if (currentUser && meRes.error?.message === 'user not found') {
      createUser({ variables: { name: currentUser.email || 'NONAME' } })
    }
  }, [currentUser, meRes])

  if (currentUser && meRes.error) {
    return <div>Error {meRes.error.message}</div>
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Alp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {
          currentUser ?
            <div>signed in as {currentUser?.displayName}<div onClick={() => firebase.auth().signOut()}>sign out</div></div> :
            <div>please <Link href="/signin">sign in</Link></div>
        }

        <ChatView width={400} height={400}></ChatView>
        <div className="w-[400px]">
          <input
            className="border-black border-2"
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { e.shiftKey && e.key === "Enter" && post() }}
          ></input>
          <button onClick={post}>send</button>
        </div>
      </main>
    </div>
  )
}
