// NOTE: this constant `__CLIENT__` is set via webpack's define plugin
// This means that webpack will *ignore* the else loop and not try and
// compile server-side files (which is good because webpack is only
//   setup for client-side builds right now)
if (__CLIENT__) {
  module.exports = require('./client');
} else {
  module.exports = require('./server');
}
