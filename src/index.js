import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {MoralisProvider} from 'react-moralis'
import {ApolloProvider} from "@apollo/client"
import {ChakraProvider} from '@chakra-ui/react'
import {apolloClient} from './graphql/Authentication/apoloClient'
import {BrowserRouter} from 'react-router-dom'
import theme from './theme/index';
import console from 'console-browserify';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <MoralisProvider appId="eREYueyBkzvQbb1oM77uaFHN9Jbak97b1k1oG5La" serverUrl="https://5msfvk6e2mxu.usemoralis.com:2053/server">
    <ChakraProvider theme={theme}>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </ApolloProvider>
    </ChakraProvider>
    </MoralisProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

