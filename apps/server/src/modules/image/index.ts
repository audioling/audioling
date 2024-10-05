import { Buffer } from 'buffer';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { rgbaToThumbHash } from 'thumbhash';
import { CONSTANTS } from '@/constants.js';

export const initImageModule = () => {
    return {
        generateThumbHashBase64: async (imageBuffer: ArrayBuffer) => {
            const image = sharp(imageBuffer);
            const resizedBlurImage = image.resize(100, 100, { fit: 'inside' });
            const resizedBlurImageBuffer = await resizedBlurImage
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true });

            const binaryThumbHash = rgbaToThumbHash(
                resizedBlurImageBuffer.info.width,
                resizedBlurImageBuffer.info.height,
                resizedBlurImageBuffer.data,
            );

            const base64ThumbHash = Buffer.from(binaryThumbHash).toString('base64');

            return base64ThumbHash;
        },
        getBufferFromPath: async (path: string) => {
            const imageBuffer = await fs.readFile(path);
            return Buffer.from(imageBuffer);
        },
        getBufferFromUrl: async (url: string) => {
            const imageResponse = await fetch(url);
            const imageBuffer = await imageResponse.arrayBuffer();
            return Buffer.from(imageBuffer);
        },
        getCacheLocation: (id: string, libraryId: string, mimetype: string) => {
            return path.join(CONSTANTS.IMAGE_DIR(libraryId), `${id}.${mimetype}`);
        },
        writeBufferToFile: async (buffer: Buffer, path: string) => {
            await fs.writeFile(path, buffer);
        },
    };
};

export type ImageModule = ReturnType<typeof initImageModule>;
