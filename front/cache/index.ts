import { makeVar } from '@apollo/client'

export const currentWorkspaceVar = makeVar<string | null>(null)
export const currentRoomVar = makeVar<string | null>(null)
