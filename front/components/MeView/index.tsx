import { useMutation, useQuery } from "@apollo/client";
import { useState, VFC } from "react";
import {
  useCreateWorkspaceMutation,
} from "../../generated/graphql";

import { graphql } from '../../gql'

const meQueryDoc = graphql(`
query me {
  me {
    id
    name
    rooms {
      id
      code
    }
    workspaces {
      id
      role
      screenName
      workspaceId
      userId
      workspace {
        id
        code
        rooms {
          id
          code
        }
        users {
          role
          userId
          user {
            id
            name
          }
        }
      }
      status
    }
  }
}`);

const acceptInvitationMutDoc = graphql(`
mutation acceptInvitation($token: String!) {
  acceptInvitation(token: $token) {
    workspace {
      id
    }
  }
}
`)

export function MeView({ className = "" }: { className?: string; }) {
  const meRes = useQuery(meQueryDoc, {});
  const [invitationToken, setInvitationToken] = useState("");
  const [accept] = useMutation(acceptInvitationMutDoc);
  const [workspaceCode, setWorkspaceCode] = useState("");
  const [createWorkspace] = useCreateWorkspaceMutation();

  return (
    <div className={className + " p-2"}>
      <span>
        name: {meRes.data?.me.name}
      </span>
      <div>
        <input
          type="text"
          value={invitationToken}
          onChange={(e) => setInvitationToken(e.target.value)} />
        <button
          onClick={() => accept({
            variables: { token: invitationToken },
            onCompleted(e) {
              console.log(e);
            },
          })}
        >
          verify
        </button>
      </div>
      <div>
        <input
          type="text"
          value={workspaceCode}
          onChange={(e) => setWorkspaceCode(e.target.value)} />
        <button
          onClick={() => createWorkspace({
            variables: { code: workspaceCode },
            onCompleted(e) {
              console.log(e);
            },
          })}
        >
          create workspace
        </button>
      </div>
    </div>
  );
}
