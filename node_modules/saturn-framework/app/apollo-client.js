// XXX: are we supposed to use isomorphic-fetch?
import 'isomorphic-fetch';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

import config from '../config';

let url;
let options = {};
if (__SERVER__) {
  options.ssrMode = true;
  url = `http://${config.host}:${config.port}/graphql`;
} else {
  options.ssrForceFetchDelay = 100;
  url = '/graphql'
}

export default (headers = {}) => new ApolloClient({
  networkInterface: createNetworkInterface(url, {
    credentials: 'same-origin',
    headers
  }),
  ...options,
});
