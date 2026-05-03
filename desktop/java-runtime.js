const fs = require('fs');
const path = require('path');
const { app } = require('electron');

/**
 * Prefer a JRE shipped next to the app (dev: desktop/runtime/jre, packaged: resources/jre).
 * Falls back to `java` on PATH only when running unpackaged (electron .).
 */
function resolveJavaForBackend(desktopDir) {
  const win = process.platform === 'win32';
  const javaName = win ? 'java.exe' : 'java';

  const devBundled = path.join(desktopDir, 'runtime', 'jre', 'bin', javaName);
  if (fs.existsSync(devBundled)) {
    return {
      java: devBundled,
      javaHome: path.join(desktopDir, 'runtime', 'jre'),
    };
  }

  if (app.isPackaged) {
    const packaged = path.join(process.resourcesPath, 'runtime', 'jre', 'bin', javaName);
    if (fs.existsSync(packaged)) {
      return {
        java: packaged,
        javaHome: path.join(process.resourcesPath, 'runtime', 'jre'),
      };
    }
    throw new Error(
      'Bundled JRE not found under resources/runtime/jre. Run npm run bundle-jre in desktop before packaging.'
    );
  }

  return { java: 'java', javaHome: process.env.JAVA_HOME || undefined };
}

module.exports = { resolveJavaForBackend };
