import { makeVar } from '@apollo/client';
import { WorkspaceUser } from './generated/graphql';

export const currentWorkspaceVar = makeVar<WorkspaceUser | null>(null)
export const currentRoomVar = makeVar<string | null>(null)
export const loggedInVar = makeVar(false);
