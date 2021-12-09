import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  TypePolicies,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import {
  getMainDefinition,
  relayStylePagination,
} from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";

export function createLink(idToken: string | undefined) {
  if (!process.env.SERVER_URL) {
    throw new Error("No server url");
  }

  const httpLink = new HttpLink({
    uri: process.env.SERVER_URL,
  });

  if (typeof window === "undefined") {
    return httpLink;
  }

  const wsLink = new WebSocketLink({
    uri: process.env.SERVER_URL.replace(/^http/, "ws"),
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: { Authorization: `Bearer ${idToken}` },
    },
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: idToken ? `Bearer ${idToken}` : "",
      },
    };
  });

  return authLink.concat(
    split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  );
}

export const createClient = (idToken?: string) => {
  const typePolicies: TypePolicies = {
    Query: {
      fields: {
        messages: relayStylePagination(),
      },
    },
  };

  return new ApolloClient({
    link: createLink(idToken),
    cache: new InMemoryCache({ typePolicies }),
  });
};
