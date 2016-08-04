#!/bin/bash

# this is a modified version of apprunnerpack designed to work only with
# vanilla node applications

set -e

NPM_PATH=/node-v4.4.5-linux-x64/bin/npm

appdir="$1"
if [ ! -d "$appdir" ]; then
  echo "Must pass a application directory" >&2
  echo "Usage: $0 <app dir>" >&2
  echo "$0 expects two files in <app dir>:" >&2
  echo "    'setup.sh' : script to install dependencies (root)" >&2
  echo "    'run.sh'   : script to start application when a container starts (non-root)" >&2
  echo "Example: $0 example" >&2
  exit 1
fi

# setup a bundle folder and copy app
workdir=$(mktemp -d)
bundledir="$workdir/bundle"
mkdir -p "$bundledir"
cp -r "$appdir/" "$bundledir"

mkdir -p "$bundledir/programs/server"

# applogger runs `npm install` here, so give it a dummy package list.
cat <<EOF > "$bundledir/programs/server/package.json"
{
"name": "dummyapp",
"version": "1.0.0",
"author": "",
"license": "ISC"
}
EOF

# applogger expects setup.sh in /app/bundle/programs/server/setup.sh
cat <<EOF > "$bundledir/programs/server/setup.sh"
#!/bin/bash

cd /app/bundle
su meteor -c "$NPM_PATH install --production"
su meteor -c "$NPM_PATH rebuild"
EOF
chmod +x "$bundledir/programs/server/setup.sh"

cat <<EOF > "$bundledir/main.js"
var spawn = require('child_process').spawn;

process.env.BABEL_DISABLE_CACHE = 1;
var cmd = spawn('$NPM_PATH', ['run', 'start'], {
  env: process.env,
  stdio: ['ignore', process.stdout, process.stderr]
});

cmd.on('close', function(code) {
  console.log('process exited with code ', code);
  process.exit(code);
});
EOF

echo -n $workdir
