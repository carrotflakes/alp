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
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<IntEdge>>>;
};

/** An edge in a connection. */
export type IntEdge = {
  __typename?: 'IntEdge';
  /** The item at the end of the edge */
  node: Scalars['Int'];
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['String'];
  uid: Scalars['String'];
  text: Scalars['String'];
};

export type MessageChanged = {
  __typename?: 'MessageChanged';
  mutationType: MutationType;
  id: Scalars['ID'];
  message?: Maybe<Message>;
};

export type MessageConnection = {
  __typename?: 'MessageConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<MessageEdge>>>;
};

/** An edge in a connection. */
export type MessageEdge = {
  __typename?: 'MessageEdge';
  /** The item at the end of the edge */
  node: Message;
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
};

export type MutationRoot = {
  __typename?: 'MutationRoot';
  postMessage: Scalars['ID'];
};


export type MutationRootPostMessageArgs = {
  text: Scalars['String'];
};

export enum MutationType {
  Created = 'CREATED',
  Deleted = 'DELETED'
}

export type MyPageInfo = {
  __typename?: 'MyPageInfo';
  startCursor: Scalars['ID'];
  endCursor: Scalars['ID'];
  hasPrev: Scalars['Boolean'];
  hasNext: Scalars['Boolean'];
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

export type PagedMessages = {
  __typename?: 'PagedMessages';
  pageInfo: MyPageInfo;
  messages: Array<Message>;
};

export type PagingInput = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['ID']>;
  after?: Maybe<Scalars['ID']>;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  allMessages: Array<Message>;
  messagesOld: PagedMessages;
  messages: MessageConnection;
  session?: Maybe<Scalars['String']>;
  numbers: IntConnection;
};


export type QueryRootMessagesOldArgs = {
  paging: PagingInput;
};


export type QueryRootMessagesArgs = {
  after?: Maybe<Scalars['String']>;
  before?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
};


export type QueryRootNumbersArgs = {
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
};

export type AllMessagesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllMessagesQuery = (
  { __typename?: 'QueryRoot' }
  & { allMessages: Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'id' | 'uid' | 'text'>
  )> }
);

export type MessagesQueryVariables = Exact<{
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
        & Pick<Message, 'id' | 'uid' | 'text'>
      ) }
    )>>> }
  ) }
);

export type MessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageAddedSubscription = (
  { __typename?: 'SubscriptionRoot' }
  & { messages: (
    { __typename?: 'MessageChanged' }
    & { message?: Maybe<(
      { __typename?: 'Message' }
      & Pick<Message, 'id' | 'uid' | 'text'>
    )> }
  ) }
);


export const AllMessagesDocument = gql`
    query allMessages {
  allMessages {
    id
    uid
    text
  }
}
    `;

/**
 * __useAllMessagesQuery__
 *
 * To run a query within a React component, call `useAllMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllMessagesQuery(baseOptions?: Apollo.QueryHookOptions<AllMessagesQuery, AllMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllMessagesQuery, AllMessagesQueryVariables>(AllMessagesDocument, options);
      }
export function useAllMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllMessagesQuery, AllMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllMessagesQuery, AllMessagesQueryVariables>(AllMessagesDocument, options);
        }
export type AllMessagesQueryHookResult = ReturnType<typeof useAllMessagesQuery>;
export type AllMessagesLazyQueryHookResult = ReturnType<typeof useAllMessagesLazyQuery>;
export type AllMessagesQueryResult = Apollo.QueryResult<AllMessagesQuery, AllMessagesQueryVariables>;
export const MessagesDocument = gql`
    query messages($last: Int!, $startCursor: String) {
  messages(last: $last, before: $startCursor) {
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    edges {
      node {
        id
        uid
        text
      }
    }
  }
}
    `;

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
export const MessageAddedDocument = gql`
    subscription messageAdded {
  messages(mutationType: CREATED) {
    message {
      id
      uid
      text
    }
  }
}
    `;

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
 *   },
 * });
 */
export function useMessageAddedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MessageAddedSubscription, MessageAddedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageAddedSubscription, MessageAddedSubscriptionVariables>(MessageAddedDocument, options);
      }
export type MessageAddedSubscriptionHookResult = ReturnType<typeof useMessageAddedSubscription>;
export type MessageAddedSubscriptionResult = Apollo.SubscriptionResult<MessageAddedSubscription>;