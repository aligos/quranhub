import apiServer from 'saturn-framework/api';

import { apolloServer } from 'apollo-server';

import schema from './schema';
import context from './context';

apiServer.use('/graphql', apolloServer({
  graphiql: true,
  pretty: true,
  schema,
  context,
}));

apiServer.start();
