#!/usr/bin/env node

var originalArgv = process.argv;
var command = require('yargs').argv._.shift();
var camelcase = require('camelcase');

// XXX: figure out the best way to hook up this dotenv / config
require('dotenv').config({ silent: true });
if (command === 'build' || command === 'start-prod'
    || command === 'start-prod-api' || command === 'start'
    || command === 'create' || command === 'test'
    || command === 'deploy') {
  process.env.NODE_ENV = 'production';
} else {
  process.env.NODE_ENV = 'development';
}

if (!process.env.NO_PIPING && process.env.NODE_ENV !== 'production') {
  if (require('piping')({ hook: true })) {
    run();
  }
} else {
  run();
}

function run() {
  require('../babel/server.babel'); // babel registration (runtime transpilation for node)

  require('./commands')[camelcase(command)](originalArgv);
}
