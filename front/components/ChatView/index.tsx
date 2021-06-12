import 'tailwindcss/tailwind.css'

import { createRef, FC, RefObject, useCallback, useEffect, useState } from "react";
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
      {messages.map((e: any, i: number) => <Message key={i} user={e.uid} text={e.text} scrollTo={i === messages.length - 1} />)}
    </div>
  )
}

const Message: FC<{ user: string, text: string, scrollTo: boolean }> = ({ user, text, scrollTo }) => {
  const a = useCallback((e: HTMLDivElement) => {
    scrollTo && e?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [scrollTo])
  return (
    <div ref={a}>
      <div className="opacity-60">{user}</div>
      <div className="text-xl">{text}</div>
    </div>
  )
}
