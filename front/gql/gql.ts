/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\nquery me {\n  me {\n    id\n    name\n    rooms {\n      id\n      code\n    }\n    workspaces {\n      id\n      role\n      screenName\n      workspaceId\n      userId\n      workspace {\n        id\n        code\n        rooms {\n          id\n          code\n        }\n        users {\n          role\n          userId\n          user {\n            id\n            name\n          }\n        }\n      }\n      status\n    }\n  }\n}": types.MeDocument,
    "\nmutation acceptInvitation($token: String!) {\n  acceptInvitation(token: $token) {\n    workspace {\n      id\n    }\n  }\n}\n": types.AcceptInvitationDocument,
    "query workspaceUsers($workspaceId: ID!) {\n  workspace(id: $workspaceId) {\n    id\n    users {\n      id\n      role\n      screenName\n      status\n    }\n  }\n}": types.WorkspaceUsersDocument,
    "query workspace($id: ID!) {\n  workspace(id: $id) {\n    rooms {\n      id\n      code\n    }\n    users {\n      role\n      screenName\n      user {\n        id\n        name\n      }\n      status\n    }\n  }\n}\n\nmutation leaveFromWorkspace($workspaceId: ID!) {\n  leaveFromWorkspace(workspaceId: $workspaceId)\n}\n\nmutation invite($workspaceId: ID!) {\n  invite(workspaceId: $workspaceId) {\n    token\n  }\n}\n\nmutation updateUserProfile($workspaceUserId: ID!, $screenName: String!) {\n  updateUserProfile(\n    workspaceUserId: $workspaceUserId\n    profile: {screenName: $screenName}\n  ) {\n    id\n  }\n}\n\nmutation createRoom($workspaceId: ID!, $code: String!) {\n  createRoom(workspaceId: $workspaceId, code: $code) {\n    id\n  }\n}": types.WorkspaceDocument,
    "mutation updateUserStatus($workspaceUserId: ID!, $userStatus: UserStatus!) {\n  updateUserStatus(workspaceUserId: $workspaceUserId, userStatus: $userStatus)\n}": types.UpdateUserStatusDocument,
    "\n    fragment MyMessage on Message {\n  id\n  text\n  user {\n    name\n  }\n  createdAt\n}\n    ": types.MyMessageFragmentDoc,
    "\n    query me {\n  me {\n    id\n    name\n    rooms {\n      id\n      code\n    }\n    workspaces {\n      id\n      role\n      screenName\n      workspaceId\n      userId\n      workspace {\n        id\n        code\n        rooms {\n          id\n          code\n        }\n        users {\n          role\n          userId\n          user {\n            id\n            name\n          }\n        }\n      }\n      status\n    }\n  }\n}\n    ": types.MeDocument,
    "\n    mutation acceptInvitation($token: String!) {\n  acceptInvitation(token: $token) {\n    workspace {\n      id\n    }\n  }\n}\n    ": types.AcceptInvitationDocument,
    "\n    query workspaceUsers($workspaceId: ID!) {\n  workspace(id: $workspaceId) {\n    id\n    users {\n      id\n      role\n      screenName\n      status\n    }\n  }\n}\n    ": types.WorkspaceUsersDocument,
    "\n    query workspace($id: ID!) {\n  workspace(id: $id) {\n    rooms {\n      id\n      code\n    }\n    users {\n      role\n      screenName\n      user {\n        id\n        name\n      }\n      status\n    }\n  }\n}\n    ": types.WorkspaceDocument,
    "\n    mutation leaveFromWorkspace($workspaceId: ID!) {\n  leaveFromWorkspace(workspaceId: $workspaceId)\n}\n    ": types.LeaveFromWorkspaceDocument,
    "\n    mutation invite($workspaceId: ID!) {\n  invite(workspaceId: $workspaceId) {\n    token\n  }\n}\n    ": types.InviteDocument,
    "\n    mutation updateUserProfile($workspaceUserId: ID!, $screenName: String!) {\n  updateUserProfile(\n    workspaceUserId: $workspaceUserId\n    profile: {screenName: $screenName}\n  ) {\n    id\n  }\n}\n    ": types.UpdateUserProfileDocument,
    "\n    mutation updateUserStatus($workspaceUserId: ID!, $userStatus: UserStatus!) {\n  updateUserStatus(workspaceUserId: $workspaceUserId, userStatus: $userStatus)\n}\n    ": types.UpdateUserStatusDocument,
    "\n    subscription usersInWorkspace($workspaceId: ID!) {\n  usersInWorkspace(workspaceId: $workspaceId) {\n    id\n    user {\n      id\n    }\n    status\n  }\n}\n    ": types.UsersInWorkspaceDocument,
    "\n    mutation createWorkspace($code: String!) {\n  createWorkspace(code: $code) {\n    id\n  }\n}\n    ": types.CreateWorkspaceDocument,
    "\n    mutation createUser($name: String!) {\n  createUser(name: $name) {\n    id\n    uid\n    name\n  }\n}\n    ": types.CreateUserDocument,
    "\n    query messages($roomId: ID!, $last: Int!, $startCursor: String) {\n  messages(roomId: $roomId, last: $last, before: $startCursor) {\n    pageInfo {\n      startCursor\n      endCursor\n      hasPreviousPage\n      hasNextPage\n    }\n    edges {\n      node {\n        ...MyMessage\n      }\n    }\n  }\n}\n    ": types.MessagesDocument,
    "\n    mutation postMessage($roomId: ID!, $text: String!) {\n  postMessage(roomId: $roomId, text: $text) {\n    id\n    text\n    user {\n      id\n      name\n    }\n    createdAt\n  }\n}\n    ": types.PostMessageDocument,
    "\n    subscription messageAdded($roomId: ID!) {\n  messages(mutationType: CREATED, roomId: $roomId) {\n    message {\n      ...MyMessage\n    }\n  }\n}\n    ": types.MessageAddedDocument,
    "subscription usersInWorkspace($workspaceId: ID!) {\n  usersInWorkspace(workspaceId: $workspaceId) {\n    id\n    user {\n      id\n    }\n    status\n  }\n}\n\nmutation createWorkspace($code: String!) {\n  createWorkspace(code: $code) {\n    id\n  }\n}": types.UsersInWorkspaceDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery me {\n  me {\n    id\n    name\n    rooms {\n      id\n      code\n    }\n    workspaces {\n      id\n      role\n      screenName\n      workspaceId\n      userId\n      workspace {\n        id\n        code\n        rooms {\n          id\n          code\n        }\n        users {\n          role\n          userId\n          user {\n            id\n            name\n          }\n        }\n      }\n      status\n    }\n  }\n}"): (typeof documents)["\nquery me {\n  me {\n    id\n    name\n    rooms {\n      id\n      code\n    }\n    workspaces {\n      id\n      role\n      screenName\n      workspaceId\n      userId\n      workspace {\n        id\n        code\n        rooms {\n          id\n          code\n        }\n        users {\n          role\n          userId\n          user {\n            id\n            name\n          }\n        }\n      }\n      status\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nmutation acceptInvitation($token: String!) {\n  acceptInvitation(token: $token) {\n    workspace {\n      id\n    }\n  }\n}\n"): (typeof documents)["\nmutation acceptInvitation($token: String!) {\n  acceptInvitation(token: $token) {\n    workspace {\n      id\n    }\n  }\n}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query workspaceUsers($workspaceId: ID!) {\n  workspace(id: $workspaceId) {\n    id\n    users {\n      id\n      role\n      screenName\n      status\n    }\n  }\n}"): (typeof documents)["query workspaceUsers($workspaceId: ID!) {\n  workspace(id: $workspaceId) {\n    id\n    users {\n      id\n      role\n      screenName\n      status\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query workspace($id: ID!) {\n  workspace(id: $id) {\n    rooms {\n      id\n      code\n    }\n    users {\n      role\n      screenName\n      user {\n        id\n        name\n      }\n      status\n    }\n  }\n}\n\nmutation leaveFromWorkspace($workspaceId: ID!) {\n  leaveFromWorkspace(workspaceId: $workspaceId)\n}\n\nmutation invite($workspaceId: ID!) {\n  invite(workspaceId: $workspaceId) {\n    token\n  }\n}\n\nmutation updateUserProfile($workspaceUserId: ID!, $screenName: String!) {\n  updateUserProfile(\n    workspaceUserId: $workspaceUserId\n    profile: {screenName: $screenName}\n  ) {\n    id\n  }\n}\n\nmutation createRoom($workspaceId: ID!, $code: String!) {\n  createRoom(workspaceId: $workspaceId, code: $code) {\n    id\n  }\n}"): (typeof documents)["query workspace($id: ID!) {\n  workspace(id: $id) {\n    rooms {\n      id\n      code\n    }\n    users {\n      role\n      screenName\n      user {\n        id\n        name\n      }\n      status\n    }\n  }\n}\n\nmutation leaveFromWorkspace($workspaceId: ID!) {\n  leaveFromWorkspace(workspaceId: $workspaceId)\n}\n\nmutation invite($workspaceId: ID!) {\n  invite(workspaceId: $workspaceId) {\n    token\n  }\n}\n\nmutation updateUserProfile($workspaceUserId: ID!, $screenName: String!) {\n  updateUserProfile(\n    workspaceUserId: $workspaceUserId\n    profile: {screenName: $screenName}\n  ) {\n    id\n  }\n}\n\nmutation createRoom($workspaceId: ID!, $code: String!) {\n  createRoom(workspaceId: $workspaceId, code: $code) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation updateUserStatus($workspaceUserId: ID!, $userStatus: UserStatus!) {\n  updateUserStatus(workspaceUserId: $workspaceUserId, userStatus: $userStatus)\n}"): (typeof documents)["mutation updateUserStatus($workspaceUserId: ID!, $userStatus: UserStatus!) {\n  updateUserStatus(workspaceUserId: $workspaceUserId, userStatus: $userStatus)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment MyMessage on Message {\n  id\n  text\n  user {\n    name\n  }\n  createdAt\n}\n    "): (typeof documents)["\n    fragment MyMessage on Message {\n  id\n  text\n  user {\n    name\n  }\n  createdAt\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query me {\n  me {\n    id\n    name\n    rooms {\n      id\n      code\n    }\n    workspaces {\n      id\n      role\n      screenName\n      workspaceId\n      userId\n      workspace {\n        id\n        code\n        rooms {\n          id\n          code\n        }\n        users {\n          role\n          userId\n          user {\n            id\n            name\n          }\n        }\n      }\n      status\n    }\n  }\n}\n    "): (typeof documents)["\n    query me {\n  me {\n    id\n    name\n    rooms {\n      id\n      code\n    }\n    workspaces {\n      id\n      role\n      screenName\n      workspaceId\n      userId\n      workspace {\n        id\n        code\n        rooms {\n          id\n          code\n        }\n        users {\n          role\n          userId\n          user {\n            id\n            name\n          }\n        }\n      }\n      status\n    }\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation acceptInvitation($token: String!) {\n  acceptInvitation(token: $token) {\n    workspace {\n      id\n    }\n  }\n}\n    "): (typeof documents)["\n    mutation acceptInvitation($token: String!) {\n  acceptInvitation(token: $token) {\n    workspace {\n      id\n    }\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query workspaceUsers($workspaceId: ID!) {\n  workspace(id: $workspaceId) {\n    id\n    users {\n      id\n      role\n      screenName\n      status\n    }\n  }\n}\n    "): (typeof documents)["\n    query workspaceUsers($workspaceId: ID!) {\n  workspace(id: $workspaceId) {\n    id\n    users {\n      id\n      role\n      screenName\n      status\n    }\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query workspace($id: ID!) {\n  workspace(id: $id) {\n    rooms {\n      id\n      code\n    }\n    users {\n      role\n      screenName\n      user {\n        id\n        name\n      }\n      status\n    }\n  }\n}\n    "): (typeof documents)["\n    query workspace($id: ID!) {\n  workspace(id: $id) {\n    rooms {\n      id\n      code\n    }\n    users {\n      role\n      screenName\n      user {\n        id\n        name\n      }\n      status\n    }\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation leaveFromWorkspace($workspaceId: ID!) {\n  leaveFromWorkspace(workspaceId: $workspaceId)\n}\n    "): (typeof documents)["\n    mutation leaveFromWorkspace($workspaceId: ID!) {\n  leaveFromWorkspace(workspaceId: $workspaceId)\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation invite($workspaceId: ID!) {\n  invite(workspaceId: $workspaceId) {\n    token\n  }\n}\n    "): (typeof documents)["\n    mutation invite($workspaceId: ID!) {\n  invite(workspaceId: $workspaceId) {\n    token\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateUserProfile($workspaceUserId: ID!, $screenName: String!) {\n  updateUserProfile(\n    workspaceUserId: $workspaceUserId\n    profile: {screenName: $screenName}\n  ) {\n    id\n  }\n}\n    "): (typeof documents)["\n    mutation updateUserProfile($workspaceUserId: ID!, $screenName: String!) {\n  updateUserProfile(\n    workspaceUserId: $workspaceUserId\n    profile: {screenName: $screenName}\n  ) {\n    id\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation updateUserStatus($workspaceUserId: ID!, $userStatus: UserStatus!) {\n  updateUserStatus(workspaceUserId: $workspaceUserId, userStatus: $userStatus)\n}\n    "): (typeof documents)["\n    mutation updateUserStatus($workspaceUserId: ID!, $userStatus: UserStatus!) {\n  updateUserStatus(workspaceUserId: $workspaceUserId, userStatus: $userStatus)\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription usersInWorkspace($workspaceId: ID!) {\n  usersInWorkspace(workspaceId: $workspaceId) {\n    id\n    user {\n      id\n    }\n    status\n  }\n}\n    "): (typeof documents)["\n    subscription usersInWorkspace($workspaceId: ID!) {\n  usersInWorkspace(workspaceId: $workspaceId) {\n    id\n    user {\n      id\n    }\n    status\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createWorkspace($code: String!) {\n  createWorkspace(code: $code) {\n    id\n  }\n}\n    "): (typeof documents)["\n    mutation createWorkspace($code: String!) {\n  createWorkspace(code: $code) {\n    id\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation createUser($name: String!) {\n  createUser(name: $name) {\n    id\n    uid\n    name\n  }\n}\n    "): (typeof documents)["\n    mutation createUser($name: String!) {\n  createUser(name: $name) {\n    id\n    uid\n    name\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query messages($roomId: ID!, $last: Int!, $startCursor: String) {\n  messages(roomId: $roomId, last: $last, before: $startCursor) {\n    pageInfo {\n      startCursor\n      endCursor\n      hasPreviousPage\n      hasNextPage\n    }\n    edges {\n      node {\n        ...MyMessage\n      }\n    }\n  }\n}\n    "): (typeof documents)["\n    query messages($roomId: ID!, $last: Int!, $startCursor: String) {\n  messages(roomId: $roomId, last: $last, before: $startCursor) {\n    pageInfo {\n      startCursor\n      endCursor\n      hasPreviousPage\n      hasNextPage\n    }\n    edges {\n      node {\n        ...MyMessage\n      }\n    }\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation postMessage($roomId: ID!, $text: String!) {\n  postMessage(roomId: $roomId, text: $text) {\n    id\n    text\n    user {\n      id\n      name\n    }\n    createdAt\n  }\n}\n    "): (typeof documents)["\n    mutation postMessage($roomId: ID!, $text: String!) {\n  postMessage(roomId: $roomId, text: $text) {\n    id\n    text\n    user {\n      id\n      name\n    }\n    createdAt\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    subscription messageAdded($roomId: ID!) {\n  messages(mutationType: CREATED, roomId: $roomId) {\n    message {\n      ...MyMessage\n    }\n  }\n}\n    "): (typeof documents)["\n    subscription messageAdded($roomId: ID!) {\n  messages(mutationType: CREATED, roomId: $roomId) {\n    message {\n      ...MyMessage\n    }\n  }\n}\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription usersInWorkspace($workspaceId: ID!) {\n  usersInWorkspace(workspaceId: $workspaceId) {\n    id\n    user {\n      id\n    }\n    status\n  }\n}\n\nmutation createWorkspace($code: String!) {\n  createWorkspace(code: $code) {\n    id\n  }\n}"): (typeof documents)["subscription usersInWorkspace($workspaceId: ID!) {\n  usersInWorkspace(workspaceId: $workspaceId) {\n    id\n    user {\n      id\n    }\n    status\n  }\n}\n\nmutation createWorkspace($code: String!) {\n  createWorkspace(code: $code) {\n    id\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;