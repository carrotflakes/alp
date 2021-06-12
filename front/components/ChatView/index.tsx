import 'tailwindcss/tailwind.css'

import { FC, useCallback, useState } from "react";
import { useAllMessagesQuery, useMessageAddedSubscription } from "../../generated/graphql";

type props = { width: number, height: number, fetchOlder?: () => void }

export const ChatView: FC<props> = ({ width, height, fetchOlder }) => {
  const { loading, error, data } = useAllMessagesQuery();

  const [addedMessages, setAddedMessages] = useState([] as any[])

  const onSubscriptionData = useCallback((x) => {
    const message = x.subscriptionData.data.messages.message
    setAddedMessages([...addedMessages, message])
  }, [addedMessages])

  const sub = useMessageAddedSubscription({
    onSubscriptionData,
  })

  const messages = [...(data?.allMessages || []), ...addedMessages]
  
  return (
  <div
    className="bg-blue-300 p-2 overflow-y-auto"
    style={{ width: width + 'px', height: height + 'px' }}>
    {messages.map((e: any, i: number) => <Message key={''+i} user={e.uid} text={e.text}/>)}
  </div>
  )
}

const Message: FC<{key: string, user: string, text: string}> = ({key, user, text}) => {
  return (
    <div key={key}>
      <div className="opacity-60">{user}</div>
      <div className="text-xl">{text}</div>
    </div>
  )
}
