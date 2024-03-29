import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type IntConnection = {
  __typename?: 'IntConnection';
  /** A list of edges. */
  edges: Array<IntEdge>;
  /** A list of nodes. */
  nodes: Array<Scalars['Int']['output']>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type IntEdge = {
  __typename?: 'IntEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Scalars['Int']['output'];
};

export type Message = {
  __typename?: 'Message';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  room: Room;
  text: Scalars['String']['output'];
  user: User;
};

export type MessageChanged = {
  __typename?: 'MessageChanged';
  id: Scalars['ID']['output'];
  message: Message;
  mutationType: MutationType;
};

export type MessageConnection = {
  __typename?: 'MessageConnection';
  /** A list of edges. */
  edges: Array<MessageEdge>;
  /** A list of nodes. */
  nodes: Array<Message>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MessageEdge = {
  __typename?: 'MessageEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Message;
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  acceptInvitation: WorkspaceUser;
  createRoom: Room;
  createUser: User;
  createWorkspace: Workspace;
  invite: WorkspaceInvitation;
  joinToRoom: Scalars['Boolean']['output'];
  joinToWorkspace: Scalars['Boolean']['output'];
  leaveFromWorkspace: Scalars['Boolean']['output'];
  postMessage: Message;
  updateUserProfile: WorkspaceUser;
  updateUserStatus: Scalars['Boolean']['output'];
};


export type MutationRootAcceptInvitationArgs = {
  token: Scalars['String']['input'];
};


export type MutationRootCreateRoomArgs = {
  code: Scalars['String']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationRootCreateUserArgs = {
  name: Scalars['String']['input'];
};


export type MutationRootCreateWorkspaceArgs = {
  code: Scalars['String']['input'];
};


export type MutationRootInviteArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type MutationRootJoinToRoomArgs = {
  roomId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRootJoinToWorkspaceArgs = {
  role: Role;
  screenName: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
  workspaceId: Scalars['ID']['input'];
};


export type MutationRootLeaveFromWorkspaceArgs = {
  workspaceId: Scalars['ID']['input'];
};


export type MutationRootPostMessageArgs = {
  roomId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
};


export type MutationRootUpdateUserProfileArgs = {
  profile: UpdateUserProfile;
  workspaceUserId: Scalars['ID']['input'];
};


export type MutationRootUpdateUserStatusArgs = {
  userStatus: UserStatus;
  workspaceUserId: Scalars['ID']['input'];
};

export enum MutationType {
  Created = 'CREATED',
  Deleted = 'DELETED'
}

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  allUsers: Array<User>;
  me: User;
  messages: MessageConnection;
  numbers: IntConnection;
  workspace: Workspace;
};


export type QueryRootMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  roomId: Scalars['ID']['input'];
};


export type QueryRootNumbersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRootWorkspaceArgs = {
  id: Scalars['ID']['input'];
};

export enum Role {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}

export type Room = {
  __typename?: 'Room';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  messages: MessageConnection;
};


export type RoomMessagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type SubscriptionRoot = {
  __typename?: 'SubscriptionRoot';
  interval: Scalars['Int']['output'];
  messages: MessageChanged;
  usersInWorkspace: WorkspaceUser;
};


export type SubscriptionRootIntervalArgs = {
  n?: Scalars['Int']['input'];
};


export type SubscriptionRootMessagesArgs = {
  mutationType?: InputMaybe<MutationType>;
  roomId: Scalars['ID']['input'];
};


export type SubscriptionRootUsersInWorkspaceArgs = {
  workspaceId: Scalars['ID']['input'];
};

export type UpdateUserProfile = {
  screenName: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  room: Room;
  rooms: Array<Room>;
  uid: Scalars['String']['output'];
  workspaces: Array<WorkspaceUser>;
};


export type UserRoomArgs = {
  id: Scalars['ID']['input'];
};

export enum UserStatus {
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

export type Workspace = {
  __typename?: 'Workspace';
  code: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rooms: Array<Room>;
  users: Array<WorkspaceUser>;
};

export type WorkspaceInvitation = {
  __typename?: 'WorkspaceInvitation';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  token: Scalars['String']['output'];
  workspace: Workspace;
};

export type WorkspaceUser = {
  __typename?: 'WorkspaceUser';
  id: Scalars['ID']['output'];
  role: Role;
  screenName: Scalars['String']['output'];
  status: UserStatus;
  user: User;
  userId: Scalars['ID']['output'];
  workspace: Workspace;
  workspaceId: Scalars['ID']['output'];
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'QueryRoot', me: { __typename?: 'User', id: string, name: string, rooms: Array<{ __typename?: 'Room', id: string, code: string }>, workspaces: Array<{ __typename?: 'WorkspaceUser', id: string, role: Role, screenName: string, workspaceId: string, userId: string, status: UserStatus, workspace: { __typename?: 'Workspace', id: string, code: string, rooms: Array<{ __typename?: 'Room', id: string, code: string }>, users: Array<{ __typename?: 'WorkspaceUser', role: Role, userId: string, user: { __typename?: 'User', id: string, name: string } }> } }> } };

export type AcceptInvitationMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type AcceptInvitationMutation = { __typename?: 'MutationRoot', acceptInvitation: { __typename?: 'WorkspaceUser', workspace: { __typename?: 'Workspace', id: string } } };

export type WorkspaceUsersQueryVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
}>;


export type WorkspaceUsersQuery = { __typename?: 'QueryRoot', workspace: { __typename?: 'Workspace', id: string, users: Array<{ __typename?: 'WorkspaceUser', id: string, role: Role, screenName: string, status: UserStatus }> } };

export type WorkspaceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type WorkspaceQuery = { __typename?: 'QueryRoot', workspace: { __typename?: 'Workspace', rooms: Array<{ __typename?: 'Room', id: string, code: string }>, users: Array<{ __typename?: 'WorkspaceUser', role: Role, screenName: string, status: UserStatus, user: { __typename?: 'User', id: string, name: string } }> } };

export type LeaveFromWorkspaceMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
}>;


export type LeaveFromWorkspaceMutation = { __typename?: 'MutationRoot', leaveFromWorkspace: boolean };

export type InviteMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
}>;


export type InviteMutation = { __typename?: 'MutationRoot', invite: { __typename?: 'WorkspaceInvitation', token: string } };

export type UpdateUserProfileMutationVariables = Exact<{
  workspaceUserId: Scalars['ID']['input'];
  screenName: Scalars['String']['input'];
}>;


export type UpdateUserProfileMutation = { __typename?: 'MutationRoot', updateUserProfile: { __typename?: 'WorkspaceUser', id: string } };

export type CreateRoomMutationVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
  code: Scalars['String']['input'];
}>;


export type CreateRoomMutation = { __typename?: 'MutationRoot', createRoom: { __typename?: 'Room', id: string } };

export type UpdateUserStatusMutationVariables = Exact<{
  workspaceUserId: Scalars['ID']['input'];
  userStatus: UserStatus;
}>;


export type UpdateUserStatusMutation = { __typename?: 'MutationRoot', updateUserStatus: boolean };

export type MyMessageFragment = { __typename?: 'Message', id: string, text: string, createdAt: string, user: { __typename?: 'User', name: string } };

export type UsersInWorkspaceSubscriptionVariables = Exact<{
  workspaceId: Scalars['ID']['input'];
}>;


export type UsersInWorkspaceSubscription = { __typename?: 'SubscriptionRoot', usersInWorkspace: { __typename?: 'WorkspaceUser', id: string, status: UserStatus, user: { __typename?: 'User', id: string } } };

export type CreateWorkspaceMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type CreateWorkspaceMutation = { __typename?: 'MutationRoot', createWorkspace: { __typename?: 'Workspace', id: string } };

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'MutationRoot', createUser: { __typename?: 'User', id: string, uid: string, name: string } };

export type MessagesQueryVariables = Exact<{
  roomId: Scalars['ID']['input'];
  last: Scalars['Int']['input'];
  startCursor?: InputMaybe<Scalars['String']['input']>;
}>;


export type MessagesQuery = { __typename?: 'QueryRoot', messages: { __typename?: 'MessageConnection', pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean }, edges: Array<{ __typename?: 'MessageEdge', node: { __typename?: 'Message', id: string, text: string, createdAt: string, user: { __typename?: 'User', name: string } } }> } };

export type PostMessageMutationVariables = Exact<{
  roomId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
}>;


export type PostMessageMutation = { __typename?: 'MutationRoot', postMessage: { __typename?: 'Message', id: string, text: string, createdAt: string, user: { __typename?: 'User', id: string, name: string } } };

export type MessageAddedSubscriptionVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type MessageAddedSubscription = { __typename?: 'SubscriptionRoot', messages: { __typename?: 'MessageChanged', message: { __typename?: 'Message', id: string, text: string, createdAt: string, user: { __typename?: 'User', name: string } } } };

export const MyMessageFragmentDoc = gql`
    fragment MyMessage on Message {
  id
  text
  user {
    name
  }
  createdAt
}
    `;
export const MeDocument = gql`
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
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const AcceptInvitationDocument = gql`
    mutation acceptInvitation($token: String!) {
  acceptInvitation(token: $token) {
    workspace {
      id
    }
  }
}
    `;
export type AcceptInvitationMutationFn = Apollo.MutationFunction<AcceptInvitationMutation, AcceptInvitationMutationVariables>;

/**
 * __useAcceptInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInvitationMutation, { data, loading, error }] = useAcceptInvitationMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useAcceptInvitationMutation(baseOptions?: Apollo.MutationHookOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptInvitationMutation, AcceptInvitationMutationVariables>(AcceptInvitationDocument, options);
      }
export type AcceptInvitationMutationHookResult = ReturnType<typeof useAcceptInvitationMutation>;
export type AcceptInvitationMutationResult = Apollo.MutationResult<AcceptInvitationMutation>;
export type AcceptInvitationMutationOptions = Apollo.BaseMutationOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const WorkspaceUsersDocument = gql`
    query workspaceUsers($workspaceId: ID!) {
  workspace(id: $workspaceId) {
    id
    users {
      id
      role
      screenName
      status
    }
  }
}
    `;

/**
 * __useWorkspaceUsersQuery__
 *
 * To run a query within a React component, call `useWorkspaceUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceUsersQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useWorkspaceUsersQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>(WorkspaceUsersDocument, options);
      }
export function useWorkspaceUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>(WorkspaceUsersDocument, options);
        }
export function useWorkspaceUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>(WorkspaceUsersDocument, options);
        }
export type WorkspaceUsersQueryHookResult = ReturnType<typeof useWorkspaceUsersQuery>;
export type WorkspaceUsersLazyQueryHookResult = ReturnType<typeof useWorkspaceUsersLazyQuery>;
export type WorkspaceUsersSuspenseQueryHookResult = ReturnType<typeof useWorkspaceUsersSuspenseQuery>;
export type WorkspaceUsersQueryResult = Apollo.QueryResult<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>;
export const WorkspaceDocument = gql`
    query workspace($id: ID!) {
  workspace(id: $id) {
    rooms {
      id
      code
    }
    users {
      role
      screenName
      user {
        id
        name
      }
      status
    }
  }
}
    `;

/**
 * __useWorkspaceQuery__
 *
 * To run a query within a React component, call `useWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWorkspaceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useWorkspaceQuery(baseOptions: Apollo.QueryHookOptions<WorkspaceQuery, WorkspaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WorkspaceQuery, WorkspaceQueryVariables>(WorkspaceDocument, options);
      }
export function useWorkspaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WorkspaceQuery, WorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WorkspaceQuery, WorkspaceQueryVariables>(WorkspaceDocument, options);
        }
export function useWorkspaceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<WorkspaceQuery, WorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WorkspaceQuery, WorkspaceQueryVariables>(WorkspaceDocument, options);
        }
export type WorkspaceQueryHookResult = ReturnType<typeof useWorkspaceQuery>;
export type WorkspaceLazyQueryHookResult = ReturnType<typeof useWorkspaceLazyQuery>;
export type WorkspaceSuspenseQueryHookResult = ReturnType<typeof useWorkspaceSuspenseQuery>;
export type WorkspaceQueryResult = Apollo.QueryResult<WorkspaceQuery, WorkspaceQueryVariables>;
export const LeaveFromWorkspaceDocument = gql`
    mutation leaveFromWorkspace($workspaceId: ID!) {
  leaveFromWorkspace(workspaceId: $workspaceId)
}
    `;
export type LeaveFromWorkspaceMutationFn = Apollo.MutationFunction<LeaveFromWorkspaceMutation, LeaveFromWorkspaceMutationVariables>;

/**
 * __useLeaveFromWorkspaceMutation__
 *
 * To run a mutation, you first call `useLeaveFromWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveFromWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveFromWorkspaceMutation, { data, loading, error }] = useLeaveFromWorkspaceMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useLeaveFromWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<LeaveFromWorkspaceMutation, LeaveFromWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveFromWorkspaceMutation, LeaveFromWorkspaceMutationVariables>(LeaveFromWorkspaceDocument, options);
      }
export type LeaveFromWorkspaceMutationHookResult = ReturnType<typeof useLeaveFromWorkspaceMutation>;
export type LeaveFromWorkspaceMutationResult = Apollo.MutationResult<LeaveFromWorkspaceMutation>;
export type LeaveFromWorkspaceMutationOptions = Apollo.BaseMutationOptions<LeaveFromWorkspaceMutation, LeaveFromWorkspaceMutationVariables>;
export const InviteDocument = gql`
    mutation invite($workspaceId: ID!) {
  invite(workspaceId: $workspaceId) {
    token
  }
}
    `;
export type InviteMutationFn = Apollo.MutationFunction<InviteMutation, InviteMutationVariables>;

/**
 * __useInviteMutation__
 *
 * To run a mutation, you first call `useInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [inviteMutation, { data, loading, error }] = useInviteMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useInviteMutation(baseOptions?: Apollo.MutationHookOptions<InviteMutation, InviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InviteMutation, InviteMutationVariables>(InviteDocument, options);
      }
export type InviteMutationHookResult = ReturnType<typeof useInviteMutation>;
export type InviteMutationResult = Apollo.MutationResult<InviteMutation>;
export type InviteMutationOptions = Apollo.BaseMutationOptions<InviteMutation, InviteMutationVariables>;
export const UpdateUserProfileDocument = gql`
    mutation updateUserProfile($workspaceUserId: ID!, $screenName: String!) {
  updateUserProfile(
    workspaceUserId: $workspaceUserId
    profile: {screenName: $screenName}
  ) {
    id
  }
}
    `;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      workspaceUserId: // value for 'workspaceUserId'
 *      screenName: // value for 'screenName'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const CreateRoomDocument = gql`
    mutation createRoom($workspaceId: ID!, $code: String!) {
  createRoom(workspaceId: $workspaceId, code: $code) {
    id
  }
}
    `;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, options);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const UpdateUserStatusDocument = gql`
    mutation updateUserStatus($workspaceUserId: ID!, $userStatus: UserStatus!) {
  updateUserStatus(workspaceUserId: $workspaceUserId, userStatus: $userStatus)
}
    `;
export type UpdateUserStatusMutationFn = Apollo.MutationFunction<UpdateUserStatusMutation, UpdateUserStatusMutationVariables>;

/**
 * __useUpdateUserStatusMutation__
 *
 * To run a mutation, you first call `useUpdateUserStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserStatusMutation, { data, loading, error }] = useUpdateUserStatusMutation({
 *   variables: {
 *      workspaceUserId: // value for 'workspaceUserId'
 *      userStatus: // value for 'userStatus'
 *   },
 * });
 */
export function useUpdateUserStatusMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserStatusMutation, UpdateUserStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserStatusMutation, UpdateUserStatusMutationVariables>(UpdateUserStatusDocument, options);
      }
export type UpdateUserStatusMutationHookResult = ReturnType<typeof useUpdateUserStatusMutation>;
export type UpdateUserStatusMutationResult = Apollo.MutationResult<UpdateUserStatusMutation>;
export type UpdateUserStatusMutationOptions = Apollo.BaseMutationOptions<UpdateUserStatusMutation, UpdateUserStatusMutationVariables>;
export const UsersInWorkspaceDocument = gql`
    subscription usersInWorkspace($workspaceId: ID!) {
  usersInWorkspace(workspaceId: $workspaceId) {
    id
    user {
      id
    }
    status
  }
}
    `;

/**
 * __useUsersInWorkspaceSubscription__
 *
 * To run a query within a React component, call `useUsersInWorkspaceSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUsersInWorkspaceSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersInWorkspaceSubscription({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useUsersInWorkspaceSubscription(baseOptions: Apollo.SubscriptionHookOptions<UsersInWorkspaceSubscription, UsersInWorkspaceSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UsersInWorkspaceSubscription, UsersInWorkspaceSubscriptionVariables>(UsersInWorkspaceDocument, options);
      }
export type UsersInWorkspaceSubscriptionHookResult = ReturnType<typeof useUsersInWorkspaceSubscription>;
export type UsersInWorkspaceSubscriptionResult = Apollo.SubscriptionResult<UsersInWorkspaceSubscription>;
export const CreateWorkspaceDocument = gql`
    mutation createWorkspace($code: String!) {
  createWorkspace(code: $code) {
    id
  }
}
    `;
export type CreateWorkspaceMutationFn = Apollo.MutationFunction<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;

/**
 * __useCreateWorkspaceMutation__
 *
 * To run a mutation, you first call `useCreateWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWorkspaceMutation, { data, loading, error }] = useCreateWorkspaceMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useCreateWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>(CreateWorkspaceDocument, options);
      }
export type CreateWorkspaceMutationHookResult = ReturnType<typeof useCreateWorkspaceMutation>;
export type CreateWorkspaceMutationResult = Apollo.MutationResult<CreateWorkspaceMutation>;
export type CreateWorkspaceMutationOptions = Apollo.BaseMutationOptions<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const CreateUserDocument = gql`
    mutation createUser($name: String!) {
  createUser(name: $name) {
    id
    uid
    name
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const MessagesDocument = gql`
    query messages($roomId: ID!, $last: Int!, $startCursor: String) {
  messages(roomId: $roomId, last: $last, before: $startCursor) {
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    edges {
      node {
        ...MyMessage
      }
    }
  }
}
    ${MyMessageFragmentDoc}`;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      last: // value for 'last'
 *      startCursor: // value for 'startCursor'
 *   },
 * });
 */
export function useMessagesQuery(baseOptions: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
        }
export function useMessagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesSuspenseQueryHookResult = ReturnType<typeof useMessagesSuspenseQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const PostMessageDocument = gql`
    mutation postMessage($roomId: ID!, $text: String!) {
  postMessage(roomId: $roomId, text: $text) {
    id
    text
    user {
      id
      name
    }
    createdAt
  }
}
    `;
export type PostMessageMutationFn = Apollo.MutationFunction<PostMessageMutation, PostMessageMutationVariables>;

/**
 * __usePostMessageMutation__
 *
 * To run a mutation, you first call `usePostMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePostMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [postMessageMutation, { data, loading, error }] = usePostMessageMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function usePostMessageMutation(baseOptions?: Apollo.MutationHookOptions<PostMessageMutation, PostMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PostMessageMutation, PostMessageMutationVariables>(PostMessageDocument, options);
      }
export type PostMessageMutationHookResult = ReturnType<typeof usePostMessageMutation>;
export type PostMessageMutationResult = Apollo.MutationResult<PostMessageMutation>;
export type PostMessageMutationOptions = Apollo.BaseMutationOptions<PostMessageMutation, PostMessageMutationVariables>;
export const MessageAddedDocument = gql`
    subscription messageAdded($roomId: ID!) {
  messages(mutationType: CREATED, roomId: $roomId) {
    message {
      ...MyMessage
    }
  }
}
    ${MyMessageFragmentDoc}`;

/**
 * __useMessageAddedSubscription__
 *
 * To run a query within a React component, call `useMessageAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageAddedSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useMessageAddedSubscription(baseOptions: Apollo.SubscriptionHookOptions<MessageAddedSubscription, MessageAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageAddedSubscription, MessageAddedSubscriptionVariables>(MessageAddedDocument, options);
      }
export type MessageAddedSubscriptionHookResult = ReturnType<typeof useMessageAddedSubscription>;
export type MessageAddedSubscriptionResult = Apollo.SubscriptionResult<MessageAddedSubscription>;