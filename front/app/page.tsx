"use client";

import { useReactiveVar } from "@apollo/client";
import { ChatView } from "../components/ChatView";
import { Header } from "../components/Header";
import { RoomList } from "../components/RoomList";
import { WorkspaceDetail } from "../components/WorkspaceDetail";
import { currentRoomVar, currentWorkspaceVar } from "../vars";

export default function Home() {
  const userWorkspace = useReactiveVar(currentWorkspaceVar);
  const roomId = useReactiveVar(currentRoomVar);

  return (
    <main className="w-screen h-screen m-0 flex flex-col overflow-hidden">
      <Header className="flex-initial" />

      <div className="h-1 flex-none bg-gray-200"></div>

      <div className="flex flex-row flex-1">
        <RoomList className="flex-initial" />

        {userWorkspace && !roomId && (
          <>
            <div className="w-1 flex-none bg-gray-200"></div>
            <WorkspaceDetail
              className="flex-auto"
              workspaceId={userWorkspace.workspace.id}
            ></WorkspaceDetail>
          </>
        )}

        {roomId && (
          <>
            <div className="w-1 flex-none bg-gray-200"></div>
            <ChatView className="flex-auto" roomId={roomId}></ChatView>
          </>
        )}
      </div>
    </main>
  );
}
