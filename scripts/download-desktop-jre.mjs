/**
 * Downloads Eclipse Temurin 17 JRE for the current OS/arch into desktop/runtime/jre/
 * so the Electron app can start the Spring Boot JAR without a system Java install.
 *
 * Usage (repo root): node scripts/download-desktop-jre.mjs
 * Or: npm run bundle-jre --prefix desktop
 */
import { execFileSync } from 'child_process';
import { cpSync, createWriteStream, mkdirSync, readdirSync, rmSync, statSync } from 'fs';
import { mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import { pipeline } from 'stream/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const desktopDir = path.join(repoRoot, 'desktop');
const outDir = path.join(desktopDir, 'runtime', 'jre');

function adoptiumTarget() {
  const p = process.platform;
  const a = process.arch;
  if (p === 'darwin' && a === 'arm64') return { os: 'mac', arch: 'aarch64', archive: 'tar.gz' };
  if (p === 'darwin' && a === 'x64') return { os: 'mac', arch: 'x64', archive: 'tar.gz' };
  if (p === 'linux' && a === 'arm64') return { os: 'linux', arch: 'aarch64', archive: 'tar.gz' };
  if (p === 'linux' && a === 'x64') return { os: 'linux', arch: 'x64', archive: 'tar.gz' };
  if (p === 'win32' && a === 'x64') return { os: 'windows', arch: 'x64', archive: 'zip' };
  throw new Error(`Unsupported host for automatic JRE download: ${p} ${a}`);
}

function findJavaHome(root, depth = 0) {
  const javaName = process.platform === 'win32' ? 'java.exe' : 'java';
  const binJava = path.join(root, 'bin', javaName);
  try {
    if (statSync(binJava).isFile()) return root;
  } catch {
    /* continue */
  }
  if (depth > 10) return null;
  let names;
  try {
    names = readdirSync(root);
  } catch {
    return null;
  }
  for (const name of names) {
    const sub = path.join(root, name);
    try {
      if (statSync(sub).isDirectory()) {
        const found = findJavaHome(sub, depth + 1);
        if (found) return found;
      }
    } catch {
      /* continue */
    }
  }
  return null;
}

async function main() {
  const { os, arch, archive } = adoptiumTarget();
  const url = `https://api.adoptium.net/v3/binary/latest/17/ga/${os}/${arch}/jre/hotspot/normal/eclipse?project=jdk`;

  console.log('Downloading Temurin 17 JRE from Adoptium…');
  console.log(url);

  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} downloading JRE`);
  }

  const work = path.join(tmpdir(), `fluentdoc-jre-${Date.now()}`);
  await mkdir(work, { recursive: true });
  const archivePath = path.join(work, `jre.${archive}`);
  const extractDir = path.join(work, 'extracted');

  await pipeline(res.body, createWriteStream(archivePath));

  mkdirSync(extractDir, { recursive: true });
  if (archive === 'tar.gz') {
    execFileSync('tar', ['-xzf', archivePath, '-C', extractDir], { stdio: 'inherit' });
  } else {
    execFileSync('tar', ['-xf', archivePath, '-C', extractDir], { stdio: 'inherit' });
  }

  const javaHome = findJavaHome(extractDir);
  if (!javaHome) {
    throw new Error('Could not locate bin/java inside the downloaded archive.');
  }

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(path.dirname(outDir), { recursive: true });
  cpSync(javaHome, outDir, { recursive: true });
  rmSync(work, { recursive: true, force: true });

  console.log('\nInstalled JRE to:', outDir);
  console.log('Ship this folder with your Electron build (e.g. electron-builder extraResources → jre).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
