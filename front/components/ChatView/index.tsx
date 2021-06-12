import { FC, useCallback, useState } from "react";
import 'tailwindcss/tailwind.css';
import { useMessageAddedSubscription, useMessagesQuery } from "../../generated/graphql";

type props = { width: number, height: number }

export const ChatView: FC<props> = ({ width, height }) => {
  const { loading, error, data, fetchMore } = useMessagesQuery({ variables: { last: 10 } });

  const [addedMessages, setAddedMessages] = useState([] as any[])

  const onSubscriptionData = useCallback((x) => {
    const message = x.subscriptionData.data.messages.message
    setAddedMessages([...addedMessages, message])
  }, [addedMessages])

  const sub = useMessageAddedSubscription({
    onSubscriptionData,
  })

  const fetchOlder = useCallback(() => {
    let startCursor = data?.messages.pageInfo.startCursor
    if (startCursor === '') { // Work around for async-graphql
      startCursor = null
    }
    fetchMore({
      variables: {
        last: 10,
        startCursor,
      },
    })
  }, [data, fetchMore])

  const messages = [...(data?.messages.edges?.filter(x => x).map(x => x?.node) || []), ...addedMessages]
  // console.log(messages)
  return (
    <div
      className="bg-blue-300 p-2 overflow-y-auto"
      style={{ width: width + 'px', height: height + 'px' }}
      onScroll={e => { if (e.currentTarget.scrollTop == 0) fetchOlder() }}>
      {messages.map((e: any, i: number) => <Message key={e.id} user={e.uid} text={e.text} scrollTo={i === messages.length - 1} />)}
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
