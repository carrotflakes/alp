import { FC, useCallback, useRef, useState } from "react";
import 'tailwindcss/tailwind.css';
import { useMessages } from "./messages";

type props = { width: number, height: number }

export const ChatView: FC<props> = ({ width, height }) => {
  const mes = useMessages()

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
        mes.messages.map((e: any, i: number) =>
          <Message
            key={e.id}
            user={e.uid}
            text={e.text}
            scrollTo={i === mes.messages.length - 1}
            ref_={i === 0 ? topMessageRef : undefined}
          />)
      }
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
