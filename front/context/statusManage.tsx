import { useReactiveVar } from "@apollo/client";
import { FC, useCallback, useEffect } from "react";
import { UserStatus, useUpdateUserStatusMutation } from "../generated/graphql";
import { currentWorkspaceVar, loggedInVar } from "../vars";

export const StatusManageProvider: FC = ({ children }) => {
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const loggedIn = useReactiveVar(loggedInVar);
  const workspaceUser = useReactiveVar(currentWorkspaceVar);

  const switchStatus = useCallback(
    (workspaceUserId: string, userStatus: UserStatus) => {
      return updateUserStatus({
        variables: {
          workspaceUserId,
          userStatus,
        },
      });
    },
    [updateUserStatus]
  );

  useEffect(() => {
    if (!loggedIn || !workspaceUser?.id) {
      return;
    }

    switchStatus(workspaceUser.id, UserStatus.Online);
    const intervalId = setInterval(async () => {
      await switchStatus(workspaceUser.id, UserStatus.Online);
    }, 1000 * 60 * 9); // 9 minute

    const beforeunload = () => {
      switchStatus(workspaceUser.id, UserStatus.Offline);
    };
    window.addEventListener("beforeunload", beforeunload);
    return () => {
      clearInterval(intervalId);
      switchStatus(workspaceUser.id, UserStatus.Offline);
      window.removeEventListener("beforeunload", beforeunload);
    };
  }, [loggedIn, switchStatus, workspaceUser]);

  return <>{children}</>;
};
