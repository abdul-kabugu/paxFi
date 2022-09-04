import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  gql,
  from
} from '@apollo/client';

import { onError}  from '@apollo/client/link/error'
const API_URL = 'https://api-mumbai.lens.dev';

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
    /*  console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )*/
      alert( `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) alert(`[Network error]: ${networkError}`);
});

const httpLink = from ([
  errorLink,
new HttpLink({ uri: API_URL })
]);

const authLink = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem('accessToken');
 
  operation.setContext({
      headers: {
          'x-access-token': token ? `Bearer ${token}` : '',
      },
  });

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),

  

});