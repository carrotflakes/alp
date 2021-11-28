import { useReactiveVar } from "@apollo/client";
import { FC, useCallback, useEffect } from "react";
import { UserStatus, useUpdateUserStatusMutation } from "../generated/graphql";
import { currentWorkspaceVar, loggedInVar } from "../vars";

export const StatusManageProvider: FC = ({ children }) => {
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const loggedIn = useReactiveVar(loggedInVar);
  const workspaceUser = useReactiveVar(currentWorkspaceVar);

  const switchOffline = useCallback(
    (workspaceUserId: string) => {
      updateUserStatus({
        variables: {
          workspaceUserId,
          userStatus: UserStatus.Offline,
        },
      });
    },
    [updateUserStatus]
  );

  useEffect(() => {
    if (!loggedIn || !workspaceUser?.id) {
      return;
    }

    updateUserStatus({
      variables: {
        workspaceUserId: workspaceUser.id,
        userStatus: UserStatus.Online,
      },
    });
    const intervalId = setInterval(async () => {
      await updateUserStatus({
        variables: {
          workspaceUserId: workspaceUser.id,
          userStatus: UserStatus.Online,
        },
      });
    }, 1000 * 60 * 9); // 9 minute

    const beforeunload = () => {
      switchOffline(workspaceUser.id);
    };
    window.addEventListener("beforeunload", beforeunload);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, [loggedIn, switchOffline, workspaceUser]);

  return <>{children}</>;
};
