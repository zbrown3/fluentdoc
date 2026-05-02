const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { findAngularIndexHtml, primaryAngularIndexPath } = require('./angular-dist');

const desktopDir = __dirname;
const clientDir = path.join(desktopDir, '..', 'apps', 'client');

if (!findAngularIndexHtml(desktopDir)) {
  console.log('[desktop] Angular desktop build missing; running npm run build:desktop…\n');
  if (!fs.existsSync(path.join(clientDir, 'package.json'))) {
    console.error('[desktop] Expected Angular app at:', clientDir);
    process.exit(1);
  }
  if (!fs.existsSync(path.join(clientDir, 'node_modules'))) {
    console.error(
      '[desktop] apps/client has no node_modules. Run:\n  cd apps/client && npm install\n'
    );
    process.exit(1);
  }
  const r = spawnSync('npm', ['run', 'build:desktop'], { cwd: clientDir, stdio: 'inherit', shell: true });
  if (r.status !== 0) process.exit(r.status || 1);
  if (!findAngularIndexHtml(desktopDir)) {
    console.error('[desktop] Build finished but index.html is still missing. Expected:');
    console.error(' ', primaryAngularIndexPath(desktopDir));
    process.exit(1);
  }
}

const cli = path.join(desktopDir, 'node_modules', 'electron', 'cli.js');
const child = spawn(process.execPath, [cli, '.'], { cwd: desktopDir, stdio: 'inherit' });
child.on('exit', (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 0);
});
