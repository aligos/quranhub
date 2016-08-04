/* eslint-disable */
//  enable runtime transpilation to use ES6/7 in node

var config = require('./preset');

config.ignore = require('./babel-exclude');

require('babel-register')(config);
