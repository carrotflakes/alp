import { useUsersInWorkspaceSubscription } from "../generated/graphql"

export const useSubscribeUsersInWorkspace = (workspaceId: string) => {
  useUsersInWorkspaceSubscription({variables: {workspaceId}});
}
