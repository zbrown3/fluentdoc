/**
 * Builds a notarization-friendly app.jar by removing macOS native SQLite dylibs
 * from the nested sqlite-jdbc jar, while preserving the Spring Boot executable jar.
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

function main() {
    if (!existsSync(appJar)) {
        throw new Error(`Missing ${appJar}; run: cd services/api && ./mvnw package`);
    }

    mkdirSync(path.dirname(outJar), { recursive: true });

    // Start from the original Spring Boot jar so its executable structure is preserved.
    copyFileSync(appJar, outJar);

    const work = mkdtempSync(path.join(os.tmpdir(), 'fluentdoc-strip-sqlite-'));

    try {
        // Extract only BOOT-INF/lib so we can find sqlite-jdbc.
        execFileSync(jarBin(), ['xf', outJar, 'BOOT-INF/lib'], {
            cwd: work,
            stdio: 'inherit',
        });

        const libDir = path.join(work, 'BOOT-INF', 'lib');
        const sqliteJarName = readdirSync(libDir).find((f) => /^sqlite-jdbc-.+\.jar$/.test(f));

        if (!sqliteJarName) {
            throw new Error('sqlite-jdbc-*.jar not found under BOOT-INF/lib');
        }

        const sqliteJarPath = path.join(libDir, sqliteJarName);
        const sqliteWork = mkdtempSync(path.join(os.tmpdir(), 'fluentdoc-sqlite-'));

        try {
            execFileSync(jarBin(), ['xf', sqliteJarPath], {
                cwd: sqliteWork,
                stdio: 'inherit',
            });

            const macNative = path.join(sqliteWork, 'org', 'sqlite', 'native', 'Mac');
            if (existsSync(macNative)) {
                rmSync(macNative, { recursive: true, force: true });
            }

            // Repack only sqlite-jdbc.
            execFileSync(jarBin(), ['cf', sqliteJarPath, '-C', sqliteWork, '.'], {
                stdio: 'inherit',
            });
        } finally {
            rmSync(sqliteWork, { recursive: true, force: true });
        }

        // Replace only the nested sqlite-jdbc jar inside the copied Spring Boot jar.
        // -0 stores the nested jar without compression, which Spring Boot needs.
        execFileSync('zip', ['-q', '-0', outJar, `BOOT-INF/lib/${sqliteJarName}`], {
            cwd: work,
            stdio: 'inherit',
        });

        console.log('Wrote stripped app.jar:', outJar);
    } finally {
        rmSync(work, { recursive: true, force: true });
    }
}

main();