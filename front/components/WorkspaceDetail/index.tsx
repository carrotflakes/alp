"use client";

import { useReactiveVar } from "@apollo/client";
import { useCallback, useEffect, useState, VFC } from "react";
import {
  useCreateRoomMutation,
  useInviteMutation,
  useLeaveFromWorkspaceMutation,
  useUpdateUserProfileMutation,
  useWorkspaceQuery,
} from "../../generated/graphql";
import { useSubscribeUsersInWorkspace } from "../../hooks/subscribeUsersInWorkspace";
import { currentWorkspaceVar } from "../../vars";

type props = {
  className?: string;
  workspaceId: string;
};

export const WorkspaceDetail = ({
  className = "",
  workspaceId,
}: props) => {
  const { data } = useWorkspaceQuery({ variables: { id: workspaceId } });
  const [inviteMut] = useInviteMutation();
  const [leaveMut] = useLeaveFromWorkspaceMutation();
  const [createRoomMut] = useCreateRoomMutation();
  useSubscribeUsersInWorkspace(workspaceId);

  const [roomName, setRoomName] = useState("");

  const [screenName, setScreenName] = useState("");

  const workspaceUser = useReactiveVar(currentWorkspaceVar);
  useEffect(() => {
    const user = data?.workspace.users.find(
      (u) => u.user.id === workspaceUser?.userId
    );
    if (user) {
      setScreenName(user.screenName);
    }
  }, [data, workspaceUser]);

  const [updateUserProfile] = useUpdateUserProfileMutation();
  const handleUpdateUserProfile = useCallback(() => {
    if (workspaceUser) {
      updateUserProfile({
        variables: {
          workspaceUserId: workspaceUser.id,
          screenName,
        },
      }).then(() => {
        console.log("updateUserProfile");
      });
    }
  }, [screenName, workspaceUser]);

  return (
    <div className={className + " p-2"}>
      <div>
        <input
          type="text"
          value={screenName}
          onChange={(e) => setScreenName(e.target.value)}
        />
        <button onClick={handleUpdateUserProfile}>Update</button>
      </div>
      users:
      {data?.workspace.users.map((r) => (
        <div className="cursor-pointer" key={r.user.id}>
          - {r.user.name} ({r.role}) ({r.status})
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
      <br />
      <input
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button
        onClick={() => {
          createRoomMut({
            variables: { workspaceId, code: roomName },
            onCompleted(data) {
              console.log("created");
            },
          });
        }}>
        create room
      </button>
    </div>
  );
};
