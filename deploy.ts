import { $ } from 'bun';
import { execSync } from 'child_process';
import console from 'console';
import fs from 'fs';

async function main() {
    await Promise.all([$`bun run build:packages`]);

    await Promise.all([$`bun run build:server:desktop`]);

    await renameSidecar();

    await Promise.all([$`bun run build:web:desktop`]);
}

async function renameSidecar() {
    return new Promise((resolve, reject) => {
        try {
            const extension = process.platform === 'win32' ? '.exe' : '';

            const rustInfo = execSync('rustc -vV');
            const targetTriple = /host: (\S+)/g.exec(rustInfo as any)?.[1];

            console.log('targetTriple', targetTriple, extension);

            if (!targetTriple) {
                console.error('Failed to determine platform target triple');
            }

            fs.mkdirSync(`./apps/web/src-tauri/target/external`, { recursive: true });

            fs.renameSync(
                `./apps/server/dist/audioling-server${extension}`,
                `./apps/web/src-tauri/target/external/audioling-server-${targetTriple}${extension}`,
            );
        } catch (error) {
            reject(error);
        }

        resolve(null);
    });
}

main();
