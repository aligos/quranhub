/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { Router, browserHistory } from 'react-router';

import ourCreateClient from './apollo-client';
import ourCreateStore from './store';

const dest = document.getElementById('content');

import ReactDOMServer from 'react-dom/server';

export default ({ routes, createClient = ourCreateClient, createStore = ourCreateStore }) => {
  const client = createClient();
  const store = createStore({ client });

  ReactDOM.render(
    <ApolloProvider client={client} store={store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </ApolloProvider>,
    dest
  );
}
