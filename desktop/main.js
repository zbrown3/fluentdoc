const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { findAngularIndexHtml, primaryAngularIndexPath } = require('./angular-dist');
const { resolveJavaForBackend } = require('./java-runtime');

const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = 8080;
const HEALTH_PATH = '/actuator/health';

const jarPath = path.join(__dirname, '..', 'services', 'api', 'target', 'app.jar');

let backendProcess = null;
let indexHtml = '';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function checkBackendReady() {
  return new Promise((resolve) => {
    const req = http.get(
      `http://${BACKEND_HOST}:${BACKEND_PORT}${HEALTH_PATH}`,
      (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      }
    );
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForBackend(maxWaitMs) {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    if (await checkBackendReady()) return;
    await sleep(400);
  }
  throw new Error(`Backend did not become ready at http://${BACKEND_HOST}:${BACKEND_PORT}${HEALTH_PATH}`);
}

function startBackend() {
  if (!fs.existsSync(jarPath)) {
    throw new Error(`JAR not found: ${jarPath}`);
  }
  const { java, javaHome } = resolveJavaForBackend(__dirname);
  const env = { ...process.env };
  if (javaHome) {
    env.JAVA_HOME = javaHome;
    env.PATH = `${path.join(javaHome, 'bin')}${path.delimiter}${env.PATH || ''}`;
  }
  backendProcess = spawn(java, ['-jar', jarPath], {
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  backendProcess.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
  });
  backendProcess.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });
  backendProcess.on('error', (err) => {
    console.error('[backend] spawn error:', err);
  });
  backendProcess.on('exit', (code, signal) => {
    console.log('[backend] exited', { code, signal });
    backendProcess = null;
  });
}

function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill('SIGTERM');
    backendProcess = null;
  }
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  await win.loadFile(indexHtml);
}

app.whenReady().then(async () => {
  try {
    indexHtml = findAngularIndexHtml(__dirname);
    if (!indexHtml) {
      throw new Error(
        `Angular build not found at:\n  ${primaryAngularIndexPath(__dirname)}\n\n` +
          `From the desktop folder run: npm start\n` +
          `(that builds the client if needed), or:\n` +
          `  cd apps/client && npm run build:desktop`
      );
    }
    startBackend();
    await waitForBackend(120000);
    await createWindow();
  } catch (err) {
    console.error(err);
    stopBackend();
    dialog.showErrorBox('FluentDoc', err.message || String(err));
    app.quit();
  }
});

app.on('window-all-closed', () => {
  stopBackend();
  app.quit();
});

app.on('before-quit', () => {
  stopBackend();
});
