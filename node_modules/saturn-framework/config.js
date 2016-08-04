// XXX: not sure where this should live -- possibly it can be removed entirely

export default {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT || 3002,
};
