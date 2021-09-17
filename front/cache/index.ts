import { makeVar } from '@apollo/client'

export const currentRoomVar = makeVar<string | null>(null)
