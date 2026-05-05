/**
 * Builds a notarization-friendly app.jar: removes org/sqlite/native/Mac from the nested
 * sqlite-jdbc jar inside BOOT-INF/lib, then writes desktop/runtime/service/app.jar.
 *
 * Requires JDK `jar` on PATH or JAVA_HOME. Run after ./mvnw package and extract-sqlite-native.mjs.
 */
import { execFileSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const appJar = path.join(repoRoot, 'services', 'api', 'target', 'app.jar');
const outJar = path.join(repoRoot, 'desktop', 'runtime', 'service', 'app.jar');

function jarBin() {
  const home = process.env.JAVA_HOME;
  if (home) {
    const j = path.join(home, 'bin', process.platform === 'win32' ? 'jar.exe' : 'jar');
    if (existsSync(j)) return j;
  }
  return process.platform === 'win32' ? 'jar.exe' : 'jar';
}

function findSqliteJdbcPathInUnpack(unpackRoot) {
  const libDir = path.join(unpackRoot, 'BOOT-INF', 'lib');
  if (!existsSync(libDir)) return null;
  const name = readdirSync(libDir).find((f) => /^sqlite-jdbc-.+\.jar$/.test(f));
  return name ? path.join(libDir, name) : null;
}

function main() {
  if (!existsSync(appJar)) {
    throw new Error(`Missing ${appJar}; run: cd services/api && ./mvnw package`);
  }

  mkdirSync(path.dirname(outJar), { recursive: true });
  const unpack = mkdtempSync(path.join(os.tmpdir(), 'fluentdoc-app-unpack-'));

  try {
    execFileSync(jarBin(), ['xf', appJar], { cwd: unpack, stdio: 'inherit' });

    const sjPath = findSqliteJdbcPathInUnpack(unpack);
    if (!sjPath || !existsSync(sjPath)) {
      throw new Error('sqlite-jdbc-*.jar not found under BOOT-INF/lib after unpacking app.jar');
    }

    const sjUnpack = mkdtempSync(path.join(os.tmpdir(), 'fluentdoc-sj-unpack-'));
    try {
      execFileSync(jarBin(), ['xf', sjPath], { cwd: sjUnpack, stdio: 'inherit' });
      const macNative = path.join(sjUnpack, 'org', 'sqlite', 'native', 'Mac');
      if (existsSync(macNative)) {
        rmSync(macNative, { recursive: true, force: true });
      }

      const repackedSj = path.join(os.tmpdir(), `sqlite-jdbc-repacked-${Date.now()}.jar`);
      execFileSync(jarBin(), ['cf', repackedSj, '-C', sjUnpack, '.'], { stdio: 'inherit' });
      copyFileSync(repackedSj, sjPath);
      rmSync(repackedSj, { force: true });
    } finally {
      rmSync(sjUnpack, { recursive: true, force: true });
    }

    execFileSync(jarBin(), ['cf', outJar, '-C', unpack, '.'], { stdio: 'inherit' });
    console.log('Wrote stripped app.jar:', outJar);
  } finally {
    rmSync(unpack, { recursive: true, force: true });
  }
}

main();
