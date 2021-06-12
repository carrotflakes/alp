import { FC, useCallback, useRef, useState } from "react";
import 'tailwindcss/tailwind.css';
import { useMessageAddedSubscription, useMessagesQuery } from "../../generated/graphql";

type props = { width: number, height: number }

export const ChatView: FC<props> = ({ width, height }) => {
  const messagesResult = useMessagesQuery({ variables: { last: 10 } });

  const [addedMessages, setAddedMessages] = useState([] as any[])

  const onSubscriptionData = useCallback((x) => {
    const message = x.subscriptionData.data.messages.message
    setAddedMessages([...addedMessages, message])
  }, [addedMessages])

  useMessageAddedSubscription({
    onSubscriptionData,
  })

  const fetchOlder = useCallback(() => {
    if (!messagesResult || messagesResult.loading || messagesResult.error || !messagesResult.fetchMore) {
      return;
    }

    let startCursor = messagesResult.data?.messages.pageInfo.startCursor
    if (startCursor === '') { // Work around for async-graphql
      startCursor = null
    }

    messagesResult.fetchMore({
      variables: {
        last: 10,
        startCursor,
      },
    })
  }, [messagesResult])

  const messages = [...(messagesResult.data?.messages.edges?.filter(x => x).map(x => x?.node) || []), ...addedMessages]

  const containerRef = useRef<HTMLDivElement | null>(null)

  const [topMessageEl, setTopMessageEl] = useState<HTMLElement | null>(null)
  const topMessageRef = useCallback((el: HTMLElement) => {
    if (containerRef.current && topMessageEl && topMessageEl !== el) {
      const offset = topMessageEl.offsetTop - (topMessageEl.parentElement?.offsetTop || 0)
      containerRef.current.scrollTop += offset
    }
    setTopMessageEl(el)
  }, [topMessageEl])

  return (
    <div
      className="bg-blue-300 p-2 overflow-y-auto"
      style={{ width: width + 'px', height: height + 'px' }}
      onScroll={e => { if (e.currentTarget.scrollTop == 0) fetchOlder() }}
      ref={containerRef}>
      {messages.map((e: any, i: number) => <Message key={e.id} user={e.uid} text={e.text} scrollTo={i === messages.length - 1} ref_={i === 0 ? topMessageRef : undefined} />)}
    </div>
  )
}

const Message: FC<{ user: string, text: string, scrollTo: boolean, ref_?: (el: HTMLElement) => void }> = ({ user, text, scrollTo, ref_ }) => {
  const a = useCallback((e: HTMLDivElement) => {
    scrollTo && e?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [scrollTo])
  return (
    <div ref={x => { x && (a(x), ref_ && ref_(x)) }}>
      <div className="opacity-60">{user}</div>
      <div className="text-xl">{text}</div>
    </div>
  )
}
