import { VFC } from "react";
import { currentRoomVar, currentWorkspaceVar } from "../../vars";
import { useMeQuery, WorkspaceUser } from "../../generated/graphql";

type props = {};

export const RoomList: VFC<{ className?: string }> = ({ className = "" }) => {
  const meRes = useMeQuery();
  return (
    <div className={className + " w-36 p-2"}>
      {meRes.data?.me.workspaces.map((w) => (
        <div key={w.workspace.id}>
          <div
            className="cursor-pointer"
            onClick={() => {
              currentWorkspaceVar(w as WorkspaceUser);
              currentRoomVar(null);
            }}
            key={w.workspace.id}
          >
            {w.workspace.code}
          </div>
          {w.workspace.rooms.map((r) => (
            <div
              className="cursor-pointer"
              onClick={() => currentRoomVar(r.id)}
              key={r.id}
            >
              - {r.code}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
