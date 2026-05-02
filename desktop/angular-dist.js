const fs = require('fs');
const path = require('path');

function primaryAngularIndexPath(desktopDir) {
  return path.join(
    desktopDir,
    '..',
    'apps',
    'client',
    'dist',
    'fluentdoc-client',
    'browser',
    'index.html'
  );
}

/** @returns {string | null} absolute path to index.html if present */
function findAngularIndexHtml(desktopDir) {
  const candidates = [
    primaryAngularIndexPath(desktopDir),
    path.join(desktopDir, '..', 'apps', 'client', 'dist', 'index.html'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

module.exports = { findAngularIndexHtml, primaryAngularIndexPath };
