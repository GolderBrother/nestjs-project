import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

import './index.css'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
)
