/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type IntConnection = {
  __typename?: 'IntConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<IntEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type IntEdge = {
  __typename?: 'IntEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Scalars['Int'];
};

export type Message = {
  __typename?: 'Message';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  room: Room;
  text: Scalars['String'];
  user: User;
};

export type MessageChanged = {
  __typename?: 'MessageChanged';
  id: Scalars['ID'];
  message: Message;
  mutationType: MutationType;
};

export type MessageConnection = {
  __typename?: 'MessageConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<MessageEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type MessageEdge = {
  __typename?: 'MessageEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
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
  joinToRoom: Scalars['Boolean'];
  joinToWorkspace: Scalars['Boolean'];
  leaveFromWorkspace: Scalars['Boolean'];
  postMessage: Message;
  updateUserProfile: WorkspaceUser;
  updateUserStatus: Scalars['Boolean'];
};


export type MutationRootAcceptInvitationArgs = {
  token: Scalars['String'];
};


export type MutationRootCreateRoomArgs = {
  code: Scalars['String'];
  workspaceId: Scalars['ID'];
};


export type MutationRootCreateUserArgs = {
  name: Scalars['String'];
};


export type MutationRootCreateWorkspaceArgs = {
  code: Scalars['String'];
};


export type MutationRootInviteArgs = {
  workspaceId: Scalars['ID'];
};


export type MutationRootJoinToRoomArgs = {
  roomId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationRootJoinToWorkspaceArgs = {
  role: Role;
  screenName: Scalars['String'];
  userId: Scalars['ID'];
  workspaceId: Scalars['ID'];
};


export type MutationRootLeaveFromWorkspaceArgs = {
  workspaceId: Scalars['ID'];
};


export type MutationRootPostMessageArgs = {
  roomId: Scalars['ID'];
  text: Scalars['String'];
};


export type MutationRootUpdateUserProfileArgs = {
  profile: UpdateUserProfile;
  workspaceUserId: Scalars['ID'];
};


export type MutationRootUpdateUserStatusArgs = {
  userStatus: UserStatus;
  workspaceUserId: Scalars['ID'];
};

export enum MutationType {
  Created = 'CREATED',
  Deleted = 'DELETED'
}

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
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
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  roomId: Scalars['ID'];
};


export type QueryRootNumbersArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryRootWorkspaceArgs = {
  id: Scalars['ID'];
};

export enum Role {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}

export type Room = {
  __typename?: 'Room';
  code: Scalars['String'];
  id: Scalars['ID'];
  messages: MessageConnection;
};


export type RoomMessagesArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type SubscriptionRoot = {
  __typename?: 'SubscriptionRoot';
  interval: Scalars['Int'];
  messages: MessageChanged;
  usersInWorkspace: WorkspaceUser;
};


export type SubscriptionRootIntervalArgs = {
  n?: Scalars['Int'];
};


export type SubscriptionRootMessagesArgs = {
  mutationType?: InputMaybe<MutationType>;
  roomId: Scalars['ID'];
};


export type SubscriptionRootUsersInWorkspaceArgs = {
  workspaceId: Scalars['ID'];
};

export type UpdateUserProfile = {
  screenName: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  room: Room;
  rooms: Array<Room>;
  uid: Scalars['String'];
  workspaces: Array<WorkspaceUser>;
};


export type UserRoomArgs = {
  id: Scalars['ID'];
};

export enum UserStatus {
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

export type Workspace = {
  __typename?: 'Workspace';
  code: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  rooms: Array<Room>;
  users: Array<WorkspaceUser>;
};

export type WorkspaceInvitation = {
  __typename?: 'WorkspaceInvitation';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  token: Scalars['String'];
  workspace: Workspace;
};

export type WorkspaceUser = {
  __typename?: 'WorkspaceUser';
  id: Scalars['ID'];
  role: Role;
  screenName: Scalars['String'];
  status: UserStatus;
  user: User;
  userId: Scalars['ID'];
  workspace: Workspace;
  workspaceId: Scalars['ID'];
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'QueryRoot', me: { __typename?: 'User', id: string, name: string, rooms: Array<{ __typename?: 'Room', id: string, code: string }>, workspaces: Array<{ __typename?: 'WorkspaceUser', id: string, role: Role, screenName: string, workspaceId: string, userId: string, status: UserStatus, workspace: { __typename?: 'Workspace', id: string, code: string, rooms: Array<{ __typename?: 'Room', id: string, code: string }>, users: Array<{ __typename?: 'WorkspaceUser', role: Role, userId: string, user: { __typename?: 'User', id: string, name: string } }> } }> } };

export type AcceptInvitationMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type AcceptInvitationMutation = { __typename?: 'MutationRoot', acceptInvitation: { __typename?: 'WorkspaceUser', workspace: { __typename?: 'Workspace', id: string } } };

export type WorkspaceUsersQueryVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;


export type WorkspaceUsersQuery = { __typename?: 'QueryRoot', workspace: { __typename?: 'Workspace', id: string, users: Array<{ __typename?: 'WorkspaceUser', id: string, role: Role, screenName: string, status: UserStatus }> } };

export type WorkspaceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type WorkspaceQuery = { __typename?: 'QueryRoot', workspace: { __typename?: 'Workspace', rooms: Array<{ __typename?: 'Room', id: string, code: string }>, users: Array<{ __typename?: 'WorkspaceUser', role: Role, screenName: string, status: UserStatus, user: { __typename?: 'User', id: string, name: string } }> } };

export type LeaveFromWorkspaceMutationVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;


export type LeaveFromWorkspaceMutation = { __typename?: 'MutationRoot', leaveFromWorkspace: boolean };

export type InviteMutationVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;


export type InviteMutation = { __typename?: 'MutationRoot', invite: { __typename?: 'WorkspaceInvitation', token: string } };

export type UpdateUserProfileMutationVariables = Exact<{
  workspaceUserId: Scalars['ID'];
  screenName: Scalars['String'];
}>;


export type UpdateUserProfileMutation = { __typename?: 'MutationRoot', updateUserProfile: { __typename?: 'WorkspaceUser', id: string } };

export type UpdateUserStatusMutationVariables = Exact<{
  workspaceUserId: Scalars['ID'];
  userStatus: UserStatus;
}>;


export type UpdateUserStatusMutation = { __typename?: 'MutationRoot', updateUserStatus: boolean };

export type MyMessageFragment = { __typename?: 'Message', id: string, text: string, createdAt: string, user: { __typename?: 'User', name: string } } & { ' $fragmentName'?: 'MyMessageFragment' };

export type UsersInWorkspaceSubscriptionVariables = Exact<{
  workspaceId: Scalars['ID'];
}>;


export type UsersInWorkspaceSubscription = { __typename?: 'SubscriptionRoot', usersInWorkspace: { __typename?: 'WorkspaceUser', id: string, status: UserStatus, user: { __typename?: 'User', id: string } } };

export type CreateWorkspaceMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type CreateWorkspaceMutation = { __typename?: 'MutationRoot', createWorkspace: { __typename?: 'Workspace', id: string } };

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'MutationRoot', createUser: { __typename?: 'User', id: string, uid: string, name: string } };

export type MessagesQueryVariables = Exact<{
  roomId: Scalars['ID'];
  last: Scalars['Int'];
  startCursor?: InputMaybe<Scalars['String']>;
}>;


export type MessagesQuery = { __typename?: 'QueryRoot', messages: { __typename?: 'MessageConnection', pageInfo: { __typename?: 'PageInfo', startCursor?: string | null, endCursor?: string | null, hasPreviousPage: boolean, hasNextPage: boolean }, edges?: Array<{ __typename?: 'MessageEdge', node: (
        { __typename?: 'Message' }
        & { ' $fragmentRefs'?: { 'MyMessageFragment': MyMessageFragment } }
      ) } | null> | null } };

export type PostMessageMutationVariables = Exact<{
  roomId: Scalars['ID'];
  text: Scalars['String'];
}>;


export type PostMessageMutation = { __typename?: 'MutationRoot', postMessage: { __typename?: 'Message', id: string, text: string, createdAt: string, user: { __typename?: 'User', id: string, name: string } } };

export type MessageAddedSubscriptionVariables = Exact<{
  roomId: Scalars['ID'];
}>;


export type MessageAddedSubscription = { __typename?: 'SubscriptionRoot', messages: { __typename?: 'MessageChanged', message: (
      { __typename?: 'Message' }
      & { ' $fragmentRefs'?: { 'MyMessageFragment': MyMessageFragment } }
    ) } };

export const MyMessageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"MyMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<MyMessageFragment, unknown>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"screenName"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const AcceptInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"acceptInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"acceptInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const WorkspaceUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"workspaceUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"screenName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<WorkspaceUsersQuery, WorkspaceUsersQueryVariables>;
export const WorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"workspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"screenName"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<WorkspaceQuery, WorkspaceQueryVariables>;
export const LeaveFromWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"leaveFromWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveFromWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}]}}]} as unknown as DocumentNode<LeaveFromWorkspaceMutation, LeaveFromWorkspaceMutationVariables>;
export const InviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"invite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<InviteMutation, InviteMutationVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"screenName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"profile"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"screenName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"screenName"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const UpdateUserStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateUserStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserStatus"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userStatus"}}}]}]}}]} as unknown as DocumentNode<UpdateUserStatusMutation, UpdateUserStatusMutationVariables>;
export const UsersInWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"usersInWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usersInWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"workspaceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<UsersInWorkspaceSubscription, UsersInWorkspaceSubscriptionVariables>;
export const CreateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const MessagesDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"messages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startCursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startCursor"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyMessage"}}]}}]}}]}}]}},...MyMessageFragmentDoc.definitions]} as unknown as DocumentNode<MessagesQuery, MessagesQueryVariables>;
export const PostMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"postMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"postMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<PostMessageMutation, PostMessageMutationVariables>;
export const MessageAddedDocument = {"kind":"Document", "definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"messageAdded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mutationType"},"value":{"kind":"EnumValue","value":"CREATED"}},{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"MyMessage"}}]}}]}}]}},...MyMessageFragmentDoc.definitions]} as unknown as DocumentNode<MessageAddedSubscription, MessageAddedSubscriptionVariables>;