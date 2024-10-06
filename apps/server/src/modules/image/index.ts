import { Buffer } from 'buffer';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { rgbaToThumbHash } from 'thumbhash';
import { CONSTANTS } from '@/constants.js';

export const initImageModule = () => {
    return {
        generateThumbHash: async (imageBuffer: ArrayBuffer) => {
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
            return {
                arrayBuffer: imageBuffer,
                buffer: Buffer.from(imageBuffer),
            };
        },
        getBufferFromUrl: async (url: string) => {
            const imageResponse = await fetch(url);
            const imageBuffer = await imageResponse.arrayBuffer();
            return {
                arrayBuffer: imageBuffer,
                buffer: Buffer.from(imageBuffer),
            };
        },
        getCacheLocation: (id: string, libraryId: string, mimetype: string) => {
            return path.join(CONSTANTS.IMAGE_DIR(libraryId), `${id}.${mimetype}`);
        },
        resize: async (buffer: Buffer, width: number, height: number) => {
            return sharp(buffer).avif().resize(width, height).toBuffer();
        },
        writeBufferToFile: async (buffer: Buffer, path: string) => {
            await fs.writeFile(path, buffer);
        },
    };
};

export type ImageModule = ReturnType<typeof initImageModule>;
