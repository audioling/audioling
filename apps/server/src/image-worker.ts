import fs from 'fs/promises';
import path from 'path';

declare let self: Worker;

self.onmessage = async (event) => {
    if (event.data.type === 'processImage') {
        const { buffer, imagePath } = event.data.payload;

        await cacheImage(imagePath, buffer);
    }
};

async function cacheImage(imagePath: string, buffer: Buffer) {
    const imageDir = path.dirname(imagePath);
    if (
        !(await fs
            .access(imageDir)
            .then(() => true)
            .catch(() => false))
    ) {
        await fs.mkdir(imageDir, { recursive: true });
    }

    await fs.writeFile(imagePath, buffer);
}
