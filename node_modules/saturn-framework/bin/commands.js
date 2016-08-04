import path from 'path';
import yargs from 'yargs';
import { spawn, exec } from 'child_process';
import fs from 'fs-extra';
import replace from 'replace-in-file';
import Mocha from 'mocha';
import glob from 'glob';
import { version as saturnVersion } from '../package.json';

import webpackDev from '../app/client/webpack-dev';
import webpackBuild from '../app/client/webpack-build';

// XXX: is there a better way to do this? Can it come in via argv?
const appRoot = process.cwd();
const saturnRoot = path.resolve(__dirname, '..');
const saturn = path.resolve(saturnRoot, './bin/saturn.js');
const concurrently = path.resolve(saturnRoot, './vendor/concurrently.js');

function appFile(filepath) {
  return path.resolve(appRoot, filepath);
}

function prepare(_argv) {
  const argv = yargs(_argv.slice(2))
    .pkgConf('saturn', appRoot)
    .argv;

  // Map remaining arguments to paths inside the app
  const command = argv._.shift();

  return {
    command,
    argv
  };
}

function doSpawn(command, args, options) {
  var child = spawn(command, args, Object.assign({
    stdio: ['ignore', process.stdout, process.stderr]
  }, options));
}

export function dev(_argv) {
  const { argv } = prepare(_argv);

  var startDev = saturn + ' start-dev ' + (argv.appServer || argv.app);
  var startDevApi = saturn + ' start-dev-api ' + argv.apiServer;
  var watchClient = saturn + ' watch-client ' + (argv.appClient || argv.app);

  doSpawn(concurrently, ['--kill-others', startDev, startDevApi, watchClient]);
};

export function start(_argv) {
  const { argv } = prepare(_argv);

  var startProd = saturn + ' start-prod ' + (argv.appServer || argv.app);
  var startProdApi = saturn + ' start-prod-api ' + argv.apiServer;

  doSpawn(concurrently, ['--kill-others', startProd, startProdApi]);
};

export function startApi(_argv) {
  const { argv } = prepare(_argv);
  require(appFile(argv._.shift() || argv.apiServer));
};

export { startApi as startDevApi, startApi as startProdApi };

function startApp(_argv) {
  const { argv } = prepare(_argv);
  global.__CLIENT__ = false;
  global.__SERVER__ = true;
  global.__DISABLE_SSR__ = false;  // <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
  global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

  // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
  var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
  global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
    .development(__DEVELOPMENT__)
    .server(process.cwd(), function() {
      require(appFile(argv._.shift() || argv.appServer || argv.app));
    });
}

export { startApp as startDev, startApp as startProd };

export function watchClient(_argv) {
  const { argv } = prepare(_argv);
  webpackDev(appFile(argv._.shift() || argv.appClient || argv.app),
    argv.webpackDev && appFile(argv.webpackDev));
};

export function build(_argv) {
  const { argv } = prepare(_argv);
  webpackBuild(appFile(argv._.shift() || argv.appClient || argv.app),
    argv.webpackProd && appFile(argv.webpackProd));
};

export function create(_argv) {
  const { argv } = prepare(_argv);
  const name = argv._.shift();

  fs.copySync(path.resolve(saturnRoot, './skel'), name);
  replace({
    files: path.resolve(name, 'package.json'),
    replace: '~name~',
    with: name,
  });
  replace({
    files: path.resolve(name, 'package.json'),
    replace: '~version~',
    with: saturnVersion,
  });
  console.log(`Created app ${name}.
Install dependencies with \`npm install\`.
Run the app in development with \`saturn dev\`.
`);
};

export function test(_argv) {
  const mocha = new Mocha({});

  glob(`${appRoot}/**/*.test?(s).js`, (err, files) => {
    files.filter(f => !f.match('node_modules')).forEach(f => mocha.addFile(f));

    // Run the tests.
    mocha.run(function(failures){
      process.on('exit', function () {
        process.exit(failures);  // exit with non-zero status if there were failures
      });
    });
  });
};

// Deploy to galaxy
// NOTE: requires `deploy-node` branch of meteor/meteor to be available
//   in the path as `curmeteor` (note can't be an alias, use a symlink)
export function deploy(_argv) {
  const { argv } = prepare(_argv);

  const bundleCommand = `${path.resolve(saturnRoot, './bin/bundle.sh')} ${appRoot}`;
  console.log(`running ${bundleCommand}`);
  exec(bundleCommand, (error, stdout, stderr) => {
    const bundleDir = stdout;
    doSpawn('curmeteor', ['deploy-node', argv._.shift()], {
      cwd: bundleDir
    });
  });
};
