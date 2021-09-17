import { useCallback } from "react";
import { useMeQuery, usePostMessageMutation } from "../generated/graphql";

export const usePostMessage = () => {
  const [postMessageMut] = usePostMessageMutation();
  const { data: me } = useMeQuery();

  const postMessage = useCallback(
    (roomId: string, text: string) => {
      if (!me) return;
      postMessageMut({
        variables: { roomId, text },
        optimisticResponse: {
          postMessage: {
            id: "temp-id",
            __typename: "Message",
            text,
            createdAt: "",
            user: me.me,
          },
        },
      });
    },
    [me]
  );

  return postMessage;
};
