import fs from 'fs';
import path from 'path';
import type { LibraryItemType } from '@repo/shared-types';
import type { AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database';
import { imageWorker } from '@/index.js';
import type { ImageModule } from '@/modules/image/index.js';

// SECTION - Image Service
export const initImageService = (modules: { db: AppDatabase; imageModule: ImageModule }) => {
    const { db, imageModule } = modules;

    return {
        // ANCHOR - Get Cover Art Buffer
        getCoverArtBuffer: async (
            adapter: AdapterApi,
            args: { id: string; libraryId: string; size?: number; type: LibraryItemType },
            cache: boolean = true,
        ) => {
            const imagePath = path.join(
                CONSTANTS.CACHE_DIR(args.libraryId),
                (args.size || 300).toString(),
                args.id,
            );

            if (cache) {
                if (fs.existsSync(imagePath)) {
                    const { buffer } = await imageModule.getBufferFromPath(imagePath);
                    return buffer;
                }
            }

            const { buffer } = await imageModule.getBufferFromUrl(adapter._getCoverArtUrl(args));
            // const avifBuffer = await imageModule.convertToAvif(buffer);

            // Cache image in the worker
            imageWorker.postMessage({
                payload: { buffer: buffer, imagePath, shouldCache: cache },
                type: 'processImage',
            });

            // cacheImage(imagePath, buffer);

            return buffer;
        },
        // ANCHOR - Get Thumbhash
        getThumbHash: async (args: { id: string; libraryId: string; type: LibraryItemType }) => {
            const [err, thumbHash] = db.thumbhash.findById(args.libraryId, args.id);

            if (err) {
                return null;
            }

            return thumbHash;
        },
    };
};

export type ImageService = ReturnType<typeof initImageService>;

// async function isCached(imagePath: string) {
//     return fs.exists(imagePath);
// }

// async function cacheImage(imagePath: string, buffer: Buffer) {
//     // Check if image directory exists, if not create it
//     const imageDir = path.dirname(imagePath);
//     if (!fs.existsSync(imageDir)) {
//         fs.mkdirSync(imageDir, { recursive: true });
//     }

//     fs.writeFileSync(imagePath, buffer);
// }
