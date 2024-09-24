import { Buffer } from 'buffer';
import fs from 'fs/promises';
import path from 'path';
import { LibraryType } from '@repo/shared-types';
import sharp from 'sharp';
import { rgbaToThumbHash, thumbHashToDataURL } from 'thumbhash';
import { CONSTANTS } from '@/constants.js';
import type { IdFactoryModule } from '@/modules/id/index.js';
import { utils } from '@/utils/index.js';

export const initImageModule = (modules: { idFactory: IdFactoryModule }) => {
    const { idFactory } = modules;

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
        getArrayBufferFromPath: async (path: string) => {
            const imageBuffer = await fs.readFile(path);
            return imageBuffer;
        },
        getArrayBufferFromUrl: async (url: string) => {
            const imageResponse = await fetch(url);
            const imageBuffer = await imageResponse.arrayBuffer();
            return imageBuffer;
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
        getFromUrlAndWrite: async (
            url: string,
            options: {
                size?: number;
            },
        ) => {
            const id = idFactory.generate();
            const imageResponse = await fetch(url);
            const imageBuffer = await imageResponse.arrayBuffer();
            const bufferData = Buffer.from(imageBuffer);
            const imagePath = path.join(CONSTANTS.IMAGE_DIR, `${id}.webp`);

            const image = sharp(bufferData);

            await image
                .webp()
                .resize(options.size ?? 300, options.size ?? 300, { fit: 'inside' })
                .toFile(imagePath);

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

            const placeholderUrl = thumbHashToDataURL(binaryThumbHash);

            return { binaryThumbHash, imagePath, placeholderUrl };
        },
        getRemoteCoverImageUrl: (args: {
            baseUrl: string;
            credential: string;
            id: string;
            libraryType: LibraryType;
            size?: number;
            username?: string;
        }) => {
            const { id, baseUrl, credential, size, username } = args;

            const imageSize = size ?? 300;

            switch (args.libraryType) {
                case LibraryType.JELLYFIN: {
                    return (
                        `${args.baseUrl}/Items` +
                        `/${args.id}` +
                        '/Images/Primary' +
                        `?width=${size}&height=${size}` +
                        '&quality=96'
                    );
                }
                case LibraryType.SUBSONIC: {
                    const splitCredentials = utils.delimiter.reverseCredential(credential);
                    const saltOrPassword = splitCredentials[0] as string;
                    const token = splitCredentials[1] as string | undefined;

                    const credentialParams = token
                        ? `t=${token}&s=${saltOrPassword}`
                        : `p=${saltOrPassword}`;

                    return (
                        `${baseUrl}/rest/getCoverArt.view` +
                        `?id=${id}` +
                        `&${credentialParams}` +
                        `&u=${username}` +
                        '&v=1.16.0' +
                        `&c=${CONSTANTS.APP_NAME}` +
                        `&size=${imageSize}`
                    );
                }
                case LibraryType.NAVIDROME: {
                    const splitCredentials = utils.delimiter.reverseCredential(credential);
                    const saltOrPassword = splitCredentials[0] as string;
                    const token = splitCredentials[1] as string | undefined;

                    const credentialParams = token
                        ? `t=${token}&s=${saltOrPassword}`
                        : `p=${saltOrPassword}`;

                    return (
                        `${baseUrl}/rest/getCoverArt.view` +
                        `?id=${id}` +
                        `&${credentialParams}` +
                        `&u=${username}` +
                        '&v=1.16.0' +
                        `&c=${CONSTANTS.APP_NAME}` +
                        `&size=${imageSize}`
                    );
                }
                default: {
                    return null;
                }
            }
        },
    };
};

export type ImageModule = ReturnType<typeof initImageModule>;
