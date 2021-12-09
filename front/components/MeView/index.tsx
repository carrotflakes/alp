import { useState, VFC } from "react";
import {
  useAcceptInvitationMutation,
  useCreateWorkspaceMutation,
  useMeQuery
} from "../../generated/graphql";

export const MeView: VFC<{ className?: string }> = ({ className = "" }) => {
  const meRes = useMeQuery();
  const [invitationToken, setInvitationToken] = useState("");
  const [accept] = useAcceptInvitationMutation();
  const [workspaceCode, setWorkspaceCode] = useState("");
  const [createWorkspace] = useCreateWorkspaceMutation();

  return (
    <div className={className + " p-2"}>
      {meRes.data?.me.name}
      <div>
        <input
          type="text"
          value={invitationToken}
          onChange={(e) => setInvitationToken(e.target.value)}
        />
        <button
          onClick={() =>
            accept({
              variables: { token: invitationToken },
              onCompleted(e) {
                console.log(e);
              },
            })
          }
        >
          verify
        </button>
      </div>
      <div>
        <input
          type="text"
          value={workspaceCode}
          onChange={(e) => setWorkspaceCode(e.target.value)}
        />
        <button
          onClick={() =>
            createWorkspace({
              variables: { code: workspaceCode },
              onCompleted(e) {
                console.log(e);
              },
            })
          }
        >
          create workspace
        </button>
      </div>
    </div>
  );
};
