import { Buffer } from 'buffer';
import fs from 'fs/promises';
import path from 'path';
import { CONSTANTS } from '@/constants.js';

export const initImageModule = () => {
    return {
        // convertToAvif: async (buffer: Buffer) => {
        //     return sharp(buffer).avif().toBuffer();
        // },
        // generateThumbHash: async (imageBuffer: ArrayBuffer) => {
        //     const image = sharp(imageBuffer).resize(100, 100, { fit: 'inside' });
        //     const { data, info } = await image
        //         .ensureAlpha()
        //         .raw()
        //         .toBuffer({ resolveWithObject: true });

        //     const binaryThumbHash = rgbaToThumbHash(info.width, info.height, data);
        //     const base64ThumbHash = Buffer.from(binaryThumbHash).toString('base64');

        //     return base64ThumbHash;
        // },
        getBufferFromPath: async (path: string) => {
            return Buffer.from(await fs.readFile(path));
        },
        getBufferFromUrl: async (url: string) => {
            return Buffer.from(await (await fetch(url)).arrayBuffer());
        },
        getCacheLocation: (id: string, libraryId: string, mimetype: string) => {
            return path.join(CONSTANTS.IMAGE_DIR(libraryId), `${id}.${mimetype}`);
        },
        // resize: async (buffer: Buffer, size: { height: number | null; width: number | null }) => {
        //     return sharp(buffer).resize(size.width, size.height).toBuffer();
        // },
        writeBufferToFile: async (buffer: Buffer, path: string) => {
            await fs.writeFile(path, buffer);
        },
    };
};

export type ImageModule = ReturnType<typeof initImageModule>;
