import { FC, useCallback, useRef, useState } from "react";
import 'tailwindcss/tailwind.css';
import { MyMessageFragment } from "../../generated/graphql";
import { useMessages } from "./messages";

type props = { width: number, height: number }

export const ChatView: FC<props> = ({ width, height }) => {
  const mes = useMessages()

  const containerRef = useRef<HTMLDivElement | null>(null)

  const [topMessageEl, setTopMessageEl] = useState<HTMLElement | null>(null)
  const topMessageRef = useCallback((el: HTMLElement) => {
    if (containerRef.current && topMessageEl && topMessageEl !== el) {
      const offset = topMessageEl.offsetTop - (topMessageEl.parentElement?.offsetTop || 0)
      const containerEl = containerRef.current
      setTimeout(() => {
        containerEl.scrollTop += offset
      }, 10)
    }
    setTopMessageEl(el)
  }, [topMessageEl])

  return (
    <div
      className="bg-blue-300 p-2 overflow-y-auto"
      style={{ width: width + 'px', height: height + 'px' }}
      onScroll={e => { if (e.currentTarget.scrollTop == 0) mes.fetchOlder() }}
      ref={containerRef}>
      {
        mes.loading ?
          <div>...</div> :
          mes.error ?
            <div>
              error: {mes.error.toString()}
            </div> : null
      }
      {
        mes.messages.map((e: MyMessageFragment, i: number) =>
          <Message
            key={e.id}
            message={e}
            scrollTo={i === mes.messages.length - 1}
            ref_={i === 0 ? topMessageRef : undefined}
          />)
      }
    </div>
  )
}

const Message: FC<{ message: MyMessageFragment, scrollTo: boolean, ref_?: (el: HTMLElement) => void }> = ({ message, scrollTo, ref_ }) => {
  const a = useCallback((e: HTMLDivElement) => {
    scrollTo && e?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [scrollTo])
  return (
    <div ref={x => { x && (a(x), ref_ && ref_(x)) }}>
      <div className="opacity-60">{message.user.name} {message.createdAt}</div>
      <div className="text-xl">{message.text}</div>
    </div>
  )
}
