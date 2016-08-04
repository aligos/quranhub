/* eslint-disable */

module.exports = function(filename) {
  return filename.match('/node_modules')
    && !(filename.match('/node_modules/saturn-framework')
         && !filename.match('/node_modules/saturn-framework/node_modules'));
};
