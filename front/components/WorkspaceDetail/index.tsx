import { VFC } from "react";
import { useInviteMutation, useLeaveFromWorkspaceMutation, useWorkspaceQuery } from "../../generated/graphql";

type props = {
  className?: string;
  workspaceId: string;
};

export const WorkspaceDetail: VFC<props> = ({
  className = "",
  workspaceId,
}) => {
  const { data } = useWorkspaceQuery({ variables: { id: workspaceId } });
  const [inviteMut] = useInviteMutation();
  const [leaveMut] = useLeaveFromWorkspaceMutation();

  return (
    <div className={className + " p-2"}>
      users:
      {data?.workspace.users.map((r) => (
        <div className="cursor-pointer" key={r.user.id}>
          - {r.user.name} ({r.role})
        </div>
      ))}
      <br />
      rooms:
      {data?.workspace.rooms.map((r) => (
        <div className="cursor-pointer" key={r.id}>
          - {r.code}
        </div>
      ))}
      <br />
      <button
        onClick={() => {
          inviteMut({
            variables: { workspaceId },
            onCompleted(data) {
              console.log("token: " + data.invite.token);
            },
          });
        }}
      >
        invite
      </button>
      <br />
      <button
        onClick={() => {
          leaveMut({
            variables: { workspaceId },
            onCompleted(data) {
              console.log("leaved");
            },
          });
        }}
      >
        leave
      </button>
    </div>
  );
};
