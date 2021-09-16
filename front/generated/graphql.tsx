import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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
  createRoom: Room;
  createUser: User;
  createWorkspace: Workspace;
  joinToRoom: Scalars['Boolean'];
  joinToWorkspace: Scalars['Boolean'];
  postMessage: Message;
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


export type MutationRootJoinToRoomArgs = {
  roomId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationRootJoinToWorkspaceArgs = {
  role: Role;
  userId: Scalars['ID'];
  workspaceId: Scalars['ID'];
};


export type MutationRootPostMessageArgs = {
  roomId: Scalars['ID'];
  text: Scalars['String'];
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
};


export type QueryRootMessagesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  roomId: Scalars['ID'];
};


export type QueryRootNumbersArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
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
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};

export type SubscriptionRoot = {
  __typename?: 'SubscriptionRoot';
  interval: Scalars['Int'];
  messages: MessageChanged;
};


export type SubscriptionRootIntervalArgs = {
  n?: Scalars['Int'];
};


export type SubscriptionRootMessagesArgs = {
  mutationType?: Maybe<MutationType>;
  roomId: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  room: Room;
  rooms: Array<Room>;
  uid: Scalars['String'];
  workspaces: Array<WorkspaceWithRole>;
};


export type UserRoomArgs = {
  id: Scalars['ID'];
};

export type UserWithRole = {
  __typename?: 'UserWithRole';
  role: Role;
  user: User;
};

export type Workspace = {
  __typename?: 'Workspace';
  code: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  rooms: Array<Room>;
  users: Array<UserWithRole>;
};

export type WorkspaceWithRole = {
  __typename?: 'WorkspaceWithRole';
  role: Role;
  workspace: Workspace;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'QueryRoot' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name'>
    & { rooms: Array<(
      { __typename?: 'Room' }
      & Pick<Room, 'id' | 'code'>
    )>, workspaces: Array<(
      { __typename?: 'WorkspaceWithRole' }
      & Pick<WorkspaceWithRole, 'role'>
      & { workspace: (
        { __typename?: 'Workspace' }
        & Pick<Workspace, 'id' | 'code'>
        & { rooms: Array<(
          { __typename?: 'Room' }
          & Pick<Room, 'id' | 'code'>
        )>, users: Array<(
          { __typename?: 'UserWithRole' }
          & Pick<UserWithRole, 'role'>
          & { user: (
            { __typename?: 'User' }
            & Pick<User, 'id' | 'name'>
          ) }
        )> }
      ) }
    )> }
  ) }
);

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateUserMutation = (
  { __typename?: 'MutationRoot' }
  & { createUser: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'uid' | 'name'>
  ) }
);

export type MessagesQueryVariables = Exact<{
  roomId: Scalars['ID'];
  last: Scalars['Int'];
  startCursor?: Maybe<Scalars['String']>;
}>;


export type MessagesQuery = (
  { __typename?: 'QueryRoot' }
  & { messages: (
    { __typename?: 'MessageConnection' }
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'startCursor' | 'endCursor' | 'hasPreviousPage' | 'hasNextPage'>
    ), edges?: Maybe<Array<Maybe<(
      { __typename?: 'MessageEdge' }
      & { node: (
        { __typename?: 'Message' }
        & MyMessageFragment
      ) }
    )>>> }
  ) }
);

export type PostMessageMutationVariables = Exact<{
  roomId: Scalars['ID'];
  text: Scalars['String'];
}>;


export type PostMessageMutation = (
  { __typename?: 'MutationRoot' }
  & { postMessage: (
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'text' | 'createdAt'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ) }
  ) }
);

export type MessageAddedSubscriptionVariables = Exact<{
  roomId: Scalars['ID'];
}>;


export type MessageAddedSubscription = (
  { __typename?: 'SubscriptionRoot' }
  & { messages: (
    { __typename?: 'MessageChanged' }
    & { message: (
      { __typename?: 'Message' }
      & MyMessageFragment
    ) }
  ) }
);

export type MyMessageFragment = (
  { __typename?: 'Message' }
  & Pick<Message, 'id' | 'text' | 'createdAt'>
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'name'>
  ) }
);

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
      role
      workspace {
        id
        code
        rooms {
          id
          code
        }
        users {
          role
          user {
            id
            name
          }
        }
      }
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
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
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
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
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