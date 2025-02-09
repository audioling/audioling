import { $ } from 'bun';
import { execSync } from 'child_process';
import console from 'console';
import fs from 'fs';

async function main() {
    async function buildX64() {
        await Promise.all([$`bun run build:packages`]);
        await Promise.all([$`bun run build:server:desktop-macos-x64`]);
        await renameSidecar('x86_64-apple-darwin');
    }

    async function buildArm64() {
        await Promise.all([$`bun run build:packages`]);
        await Promise.all([$`bun run build:server:desktop-macos-arm64`]);
        await renameSidecar('aarch64-apple-darwin');
    }

    await buildX64();
    await buildArm64();
}

async function renameSidecar(targetTripleOverride?: string) {
    return new Promise((resolve, reject) => {
        try {
            const cwd = process.cwd();

            console.log('cwd :>> ', cwd);

            let targetTriple = targetTripleOverride;
            if (!targetTriple) {
                const rustInfo = execSync('rustc -vV');
                targetTriple = /host: (\S+)/g.exec(rustInfo as any)?.[1];
            }

            console.log('targetTriple', targetTriple);

            if (!targetTriple) {
                console.error('Failed to determine platform target triple');
            }

            const binaryPath = `./apps/server/dist/audioling-server`;

            console.log('binaryPath', binaryPath);

            const isBinaryExists = fs.existsSync(binaryPath);

            if (!isBinaryExists) {
                throw new Error('Binary not found, erroring...');
            }

            console.log('isBinaryExists', isBinaryExists);

            const targetDirectory = `./apps/web/src-tauri/target/external`;

            const isTargetDirectoryExists = fs.existsSync(targetDirectory);

            if (!isTargetDirectoryExists) {
                console.log('Target directory not found, creating...');
                fs.mkdirSync(targetDirectory, { recursive: true });
                console.log('Target directory created: ', targetDirectory);
            }

            const binaryName = `audioling-server-${targetTriple}`;

            console.log('isTargetDirectoryExists', isTargetDirectoryExists);

            console.log('Moving binary to target directory...');
            fs.renameSync(binaryPath, `${targetDirectory}/${binaryName}`);
            console.log('Binary moved to target directory: ', `${targetDirectory}/${binaryName}`);
        } catch (error) {
            reject(error);
        }

        resolve(null);
    });
}

main();
