import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

let devTools = f => f;
let dehydratedState = {};

if (__CLIENT__) {
  if (window.devToolsExtension) {
    devTools = window.devToolsExtension();
  }

  if (window.__data) {
    dehydratedState = window.__data;
  }
}

// create a store given an apollo client and a set of reducers/middleware
export default ({
  client,
  reducers = {},
  middleware = [],
  state = dehydratedState
}) => createStore(
  combineReducers({
    apollo: client.reducer(),
    ...reducers,
  }),
  state,
  compose(
    applyMiddleware(client.middleware(), ...middleware),
    devTools,
  ),
);
