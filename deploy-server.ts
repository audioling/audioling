import { $ } from 'bun';
import { execSync } from 'child_process';
import console from 'console';
import fs from 'fs';

async function main() {
    const args = process.argv.slice(2);
    const targetTripleOverride = args[0];

    await Promise.all([$`bun run build:packages`]);
    await Promise.all([$`bun run build:server:desktop`]);
    await renameSidecar(targetTripleOverride);
}

async function renameSidecar(targetTripleOverride?: string) {
    return new Promise((resolve, reject) => {
        try {
            const cwd = process.cwd();

            console.log('cwd :>> ', cwd);

            const extension = process.platform === 'win32' ? '.exe' : '';

            let targetTriple = targetTripleOverride;
            if (!targetTriple) {
                const rustInfo = execSync('rustc -vV');
                targetTriple = /host: (\S+)/g.exec(rustInfo as any)?.[1];
            }

            console.log('targetTriple', targetTriple, extension);

            if (!targetTriple) {
                console.error('Failed to determine platform target triple');
            }

            const binaryPath = `./apps/server/dist/audioling-server${extension}`;

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

            const binaryName = `audioling-server-${targetTriple}${extension}`;

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
