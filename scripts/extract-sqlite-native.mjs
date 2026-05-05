/**
 * Extracts sqlite-jdbc macOS dylibs from services/api/target/app.jar into:
 *   desktop/runtime/native/sqlite/aarch64/libsqlitejdbc.dylib
 *   desktop/runtime/native/sqlite/x86_64/libsqlitejdbc.dylib
 *
 * Requires JDK `jar` on PATH or JAVA_HOME. Run after `./mvnw package` in services/api.
 */
import { execFileSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync } from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, '..');
const appJar = path.join(repoRoot, 'services', 'api', 'target', 'app.jar');
const outRoot = path.join(repoRoot, 'desktop', 'runtime', 'native', 'sqlite');

function jarBin() {
  const home = process.env.JAVA_HOME;
  if (home) {
    const j = path.join(home, 'bin', process.platform === 'win32' ? 'jar.exe' : 'jar');
    if (existsSync(j)) return j;
  }
  return process.platform === 'win32' ? 'jar.exe' : 'jar';
}

function findSqliteJdbcJarEntry() {
  const out = execFileSync(jarBin(), ['tf', appJar], { encoding: 'utf8' });
  const line = out
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find((l) => /^BOOT-INF\/lib\/sqlite-jdbc-[^/]+\.jar$/.test(l));
  if (!line) throw new Error('sqlite-jdbc-*.jar not found inside app.jar (BOOT-INF/lib)');
  return line;
}

function main() {
  if (!existsSync(appJar)) {
    throw new Error(`Missing ${appJar}; run: cd services/api && ./mvnw package`);
  }

  const jdbcEntry = findSqliteJdbcJarEntry();
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'fluentdoc-sqlite-extract-'));
  try {
    execFileSync(jarBin(), ['xf', appJar, jdbcEntry], { cwd: tmp, stdio: 'inherit' });
    const sjLocal = path.join(tmp, ...jdbcEntry.split('/'));
    if (!existsSync(sjLocal)) {
      throw new Error(`Expected extracted file at ${sjLocal}`);
    }
    execFileSync(jarBin(), ['xf', sjLocal], { cwd: tmp, stdio: 'inherit' });

    const aarch64Src = path.join(tmp, 'org', 'sqlite', 'native', 'Mac', 'aarch64', 'libsqlitejdbc.dylib');
    const x64Src = path.join(tmp, 'org', 'sqlite', 'native', 'Mac', 'x86_64', 'libsqlitejdbc.dylib');

    mkdirSync(path.join(outRoot, 'aarch64'), { recursive: true });
    mkdirSync(path.join(outRoot, 'x86_64'), { recursive: true });

    if (!existsSync(aarch64Src)) {
      throw new Error(`Missing ${aarch64Src} inside sqlite-jdbc jar`);
    }
    if (!existsSync(x64Src)) {
      throw new Error(`Missing ${x64Src} inside sqlite-jdbc jar`);
    }

    copyFileSync(aarch64Src, path.join(outRoot, 'aarch64', 'libsqlitejdbc.dylib'));
    copyFileSync(x64Src, path.join(outRoot, 'x86_64', 'libsqlitejdbc.dylib'));
    console.log('Extracted sqlite-jdbc macOS dylibs to:', outRoot);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

main();
