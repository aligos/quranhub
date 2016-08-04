import createSaturnStore from 'saturn-framework/app/store';
import createApp from 'saturn-framework/app';

import count from './reducers/count';
const createStore = ({ client }) =>
  createSaturnStore({ client, reducers: { count } });

import routes from './routes';

createApp({ routes, createStore });
