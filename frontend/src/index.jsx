import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


const cache = new InMemoryCache();

const ENTRY_POINT = 'http://localhost:4444';

const httpLink = new HttpLink({ uri: ENTRY_POINT });

const client = new ApolloClient({
    cache,
    link: httpLink
});


import worker from './worker';
import App from './sites/app';

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
    , document.getElementById('app'));

if (process.env.NODE_ENV === 'production') {
    worker();
}
