import { useCallback, useState } from "react";
import { useMessageAddedSubscription, useMessagesQuery } from "../../generated/graphql";

export const useMessages = () => {
  const pageSize = 10
  const messagesResult = useMessagesQuery({ variables: { last: pageSize } });

  const [addedMessages, setAddedMessages] = useState([] as any[])

  const onSubscriptionData = useCallback((x) => {
    const message = x.subscriptionData.data.messages.message
    setAddedMessages([...addedMessages, message])
  }, [addedMessages])

  const subResult = useMessageAddedSubscription({
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
        last: pageSize,
        startCursor,
      },
    })
  }, [messagesResult])

  const messages = [...(messagesResult.data?.messages.edges?.filter(x => x).map(x => x?.node) || []), ...addedMessages]

  return {
    loading: messagesResult.loading || subResult.loading,
    error: messagesResult.error || (!addedMessages && subResult.error),
    fetchOlder,
    messages: messages || [],
  }
}
