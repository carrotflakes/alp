"use client";

import { VFC, useCallback, useRef, useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { MyMessageFragment } from "../../generated/graphql";
import { usePostMessage } from "../../hooks/postMessage";
import { useMessages } from "./useMessages";

type props = {
  className?: string;
  roomId: string;
};

export const ChatView = ({ className = "", roomId }: props) => {
  const mes = useMessages(roomId);
  const postMessage = usePostMessage();
  const [inputText, setInputText] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [topMessageEl, setTopMessageEl] = useState<HTMLElement | null>(null);
  const topMessageRef = useCallback(
    (el: HTMLElement) => {
      if (containerRef.current && topMessageEl && topMessageEl !== el) {
        const offset =
          topMessageEl.offsetTop - (topMessageEl.parentElement?.offsetTop || 0);
        const containerEl = containerRef.current;
        setTimeout(() => {
          containerEl.scrollTop += offset;
        }, 10);
      }
      setTopMessageEl(el);
    },
    [topMessageEl]
  );

  const post = useCallback(() => {
    if (roomId) {
      postMessage(roomId, inputText);
      setInputText("");
    }
  }, [roomId, inputText, postMessage]);

  useEffect(() => {
    setTimeout(
      () =>
        containerRef.current &&
        containerRef.current.clientHeight ===
        containerRef.current.scrollHeight &&
        mes.fetchOlder(),
      100
    );
  }, [mes]);

  return (
    <div className={className + " flex flex-col"}>
      <div
        className="flex-grow h-0 p-2 overflow-y-auto"
        onScroll={(e) => {
          if (e.currentTarget.scrollTop == 0) mes.fetchOlder();
        }}
        ref={containerRef}
      >
        {mes.loading ? (
          <div>...</div>
        ) : mes.error ? (
          <div>error: {mes.error.toString()}</div>
        ) : null}
        {mes.messages.map((e: MyMessageFragment, i: number) => (
          <Message
            key={e.id}
            message={e}
            scrollTo={i === mes.messages.length - 1}
            ref_={i === 0 ? topMessageRef : undefined}
          />
        ))}
      </div>

      <div className="flex flex-initial p-1">
        <input
          className="flex-auto border-gray-200 border-2"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            e.shiftKey && e.key === "Enter" && post();
          }}
        ></input>
        <button className="m-2" onClick={post}>send</button>
      </div>
    </div>
  );
};

const Message = ({ message, scrollTo, ref_ }: {
  message: MyMessageFragment;
  scrollTo: boolean;
  ref_?: (el: HTMLElement) => void;
}) => {
  const a = useCallback(
    (e: HTMLDivElement) => {
      scrollTo &&
        e?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
    },
    [scrollTo]
  );
  return (
    <div
      ref={(x) => {
        x && (a(x), ref_ && ref_(x));
      }}
    >
      <div className="opacity-60">
        {message.user.name} {message.createdAt}
      </div>
      <div className="text-xl">{message.text}</div>
    </div>
  );
};
