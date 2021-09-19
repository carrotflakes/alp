import { VFC } from "react";
import { useWorkspaceQuery } from "../../generated/graphql";

type props = {
  className?: string;
  workspaceId: string;
};

export const WorkspaceDetail: VFC<props> = ({
  className = "",
  workspaceId,
}) => {
  const { data } = useWorkspaceQuery({ variables: { id: workspaceId } });

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
    </div>
  );
};
