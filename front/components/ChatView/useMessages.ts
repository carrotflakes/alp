import { useCallback, useEffect, useMemo } from "react";
import { MessageAddedDocument, MessageAddedSubscriptionResult, MyMessageFragment, useMessagesQuery } from "../../generated/graphql";

export const useMessages = () => {
  const pageSize = 10
  const messagesResult = useMessagesQuery({ variables: { last: pageSize } });

  useEffect(() => {
    messagesResult.subscribeToMore({
      document: MessageAddedDocument,
      updateQuery: (prev, { subscriptionData }) => {
        const newFeedItem = (subscriptionData as any as MessageAddedSubscriptionResult).data
        if (!newFeedItem?.messages.message) return prev

        return {
          ...prev,
          messages: {
            ...prev.messages,
            edges: [
              ...prev.messages.edges || [],
              {
                __typename: 'MessageEdge',
                node: newFeedItem.messages.message,
              }
            ]
          }
        }
      }
    })
  }, [])

  const fetchOlder = useCallback(() => {
    if (!messagesResult || messagesResult.loading || messagesResult.error || !messagesResult.fetchMore) {
      return
    }

    let startCursor = messagesResult.data?.messages.pageInfo.startCursor
    if (startCursor === '') { // Work around for async-graphql
      startCursor = null
    }

    messagesResult?.fetchMore({
      variables: {
        last: pageSize,
        startCursor,
      },
    })
  }, [messagesResult])

  const messages: MyMessageFragment[] = useMemo(() => messagesResult.data?.messages.edges?.filter((x): x is { node: MyMessageFragment } => !!x).map(x => x.node) || [], [messagesResult])

  return {
    loading: messagesResult.loading,
    error: messagesResult.error,
    fetchOlder,
    messages,
  }
}
