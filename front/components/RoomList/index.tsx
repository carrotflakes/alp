import { VFC } from "react";
import { currentRoomVar, currentWorkspaceVar } from "../../vars";
import { useReactiveVar } from "@apollo/client";

type props = {};

export const RoomList: VFC<{ className?: string }> = ({ className = "" }) => {
  const workspaceUser = useReactiveVar(currentWorkspaceVar);

  return (
    <div className={className + " w-36 p-2 cursor-pointer"}>
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
    </div>
  );
};
