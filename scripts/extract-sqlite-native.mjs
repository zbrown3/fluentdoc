import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'services', 'api', 'target');
const OUT = path.join(ROOT, 'desktop', 'runtime', 'native', 'sqlite');

const jars = fs
    .readdirSync(TARGET_DIR)
    .filter((file) =>
        file.endsWith('.jar') &&
        !file.endsWith('-sources.jar') &&
        !file.endsWith('-javadoc.jar')
    );

if (jars.length === 0) {
    throw new Error(`No Spring Boot JAR found in ${TARGET_DIR}`);
}

const jarPath = path.join(TARGET_DIR, jars[0]);
const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fluentdoc-sqlite-'));

fs.mkdirSync(OUT, { recursive: true });

console.log(`Using JAR: ${jarPath}`);
console.log(`Working directory: ${workDir}`);

execFileSync('jar', ['xf', jarPath], {
    cwd: workDir,
    stdio: 'inherit',
});

const libDir = path.join(workDir, 'BOOT-INF', 'lib');

if (!fs.existsSync(libDir)) {
    throw new Error(`BOOT-INF/lib not found. Is this a Spring Boot executable JAR? Checked: ${jarPath}`);
}

const sqliteJar = fs
    .readdirSync(libDir)
    .find((file) => file.startsWith('sqlite-jdbc-') && file.endsWith('.jar'));

if (!sqliteJar) {
    throw new Error(`sqlite-jdbc JAR not found in ${libDir}`);
}

const sqliteJarPath = path.join(libDir, sqliteJar);

execFileSync('jar', ['xf', sqliteJarPath], {
    cwd: workDir,
    stdio: 'inherit',
});

const archs = [
    { src: path.join(workDir, 'org', 'sqlite', 'native', 'Mac', 'aarch64', 'libsqlitejdbc.dylib'), dest: 'libsqlitejdbc-aarch64.dylib' },
    { src: path.join(workDir, 'org', 'sqlite', 'native', 'Mac', 'x86_64', 'libsqlitejdbc.dylib'), dest: 'libsqlitejdbc-x86_64.dylib' },
];

for (const arch of archs) {
    if (!fs.existsSync(arch.src)) {
        throw new Error(`Missing SQLite native library: ${arch.src}`);
    }

    const dest = path.join(OUT, arch.dest);
    fs.copyFileSync(arch.src, dest);
    fs.chmodSync(dest, 0o755);
    console.log(`Copied ${dest}`);
}

console.log('Extracted SQLite native libraries successfully.');