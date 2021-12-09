import { VFC } from "react";
import { currentRoomVar, currentWorkspaceVar } from "../../vars";
import { useReactiveVar } from "@apollo/client";

import cn from "classnames";
import { UserStatus, useWorkspaceUsersQuery } from "../../generated/graphql";

type props = {};

export const RoomList: VFC<{ className?: string }> = ({ className = "" }) => {
  const workspaceUser = useReactiveVar(currentWorkspaceVar);
  const { data: users } = useWorkspaceUsersQuery({
    skip: !workspaceUser,
    variables: {
      workspaceId: workspaceUser?.workspaceId || "",
    },
  });

  return (
    <div className={cn("w-36 p-2 overflow-hidden", className)}>
      <div onClick={() => currentRoomVar(null)}>
        {workspaceUser?.workspace.code}
      </div>
      {workspaceUser?.workspace.rooms.map((r) => (
        <div
          className="cursor-pointer"
          onClick={() => currentRoomVar(r.id)}
          key={r.id}
        >
          - {r.code}
        </div>
      ))}
      <div>users:</div>
      <div>
        {users?.workspace.users.map((u) => (
          <div className="flex" key={u.id}>
            <div
              className={cn(
                "flex-none inline-block w-2 h-2 m-auto rounded",
                u.status === UserStatus.Online ? "bg-red-400" : "bg-red-100"
              )}
            ></div>
            <span className="flex-auto">{u.screenName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
