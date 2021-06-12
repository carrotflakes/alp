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

export type PageInfo = {
  __typename?: 'PageInfo';
  startCursor: Scalars['ID'];
  endCursor: Scalars['ID'];
  hasPrev: Scalars['Boolean'];
  hasNext: Scalars['Boolean'];
};

export type PagedMessages = {
  __typename?: 'PagedMessages';
  pageInfo: PageInfo;
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
  messages: PagedMessages;
  session?: Maybe<Scalars['String']>;
};


export type QueryRootMessagesArgs = {
  paging: PagingInput;
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

export type MessageAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageAddedSubscription = (
  { __typename?: 'SubscriptionRoot' }
  & { messages: (
    { __typename?: 'MessageChanged' }
    & { message?: Maybe<(
      { __typename?: 'Message' }
      & Pick<Message, 'uid' | 'text'>
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
export const MessageAddedDocument = gql`
    subscription messageAdded {
  messages(mutationType: CREATED) {
    message {
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