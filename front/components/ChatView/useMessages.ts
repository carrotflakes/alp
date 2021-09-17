import { useCallback, useEffect, useMemo } from "react";
import {
  MessageAddedDocument,
  MessageAddedSubscriptionResult,
  MyMessageFragment,
  useMessagesQuery,
} from "../../generated/graphql";

export const useMessages = (roomId: string) => {
  const pageSize = 10;
  const messagesResult = useMessagesQuery({
    variables: { roomId, last: pageSize },
  });

  useEffect(() => {
    messagesResult.refetch();
  }, [roomId]);

  useEffect(() => {
    messagesResult.subscribeToMore({
      document: MessageAddedDocument,
      variables: { roomId },
      updateQuery: (prev, { subscriptionData }) => {
        // FIXME: roomId を変更すると複数サブスクリプションが生きてしまう
        const newFeedItem = (
          subscriptionData as any as MessageAddedSubscriptionResult
        ).data;
        if (!newFeedItem?.messages.message) return prev;

        // 重複削除
        if (
          prev.messages.edges?.find(
            (x) => x?.node.id === newFeedItem.messages.message.id
          )
        )
          return prev;

        return {
          ...prev,
          messages: {
            ...prev.messages,
            edges: [
              ...(prev.messages.edges || []),
              {
                __typename: "MessageEdge",
                node: newFeedItem.messages.message,
              },
            ],
          },
        };
      },
    });
  }, [roomId, messagesResult]);

  const fetchOlder = useCallback(() => {
    if (
      !messagesResult ||
      messagesResult.loading ||
      messagesResult.error ||
      !messagesResult.fetchMore
    ) {
      return;
    }

    let startCursor = messagesResult.data?.messages.pageInfo.startCursor;
    if (startCursor === "") {
      // Work around for async-graphql
      startCursor = null;
    }

    messagesResult?.fetchMore({
      variables: {
        roomId,
        last: pageSize,
        startCursor,
      },
    });
  }, [roomId, messagesResult]);

  const messages: MyMessageFragment[] = useMemo(
    () =>
      messagesResult.data?.messages.edges
        ?.filter((x): x is { node: MyMessageFragment } => !!x)
        .filter((x, i, a) => a.findIndex((y) => x.node.id === y.node.id) === i) // remove duplicate
        .map((x) => x.node) || [],
    [messagesResult]
  );

  return {
    loading: messagesResult.loading,
    error: messagesResult.error,
    fetchOlder,
    messages,
  };
};
