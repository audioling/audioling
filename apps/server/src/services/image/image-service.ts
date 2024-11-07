import fs from 'fs/promises';
import path from 'path';
import type { LibraryItemType } from '@repo/shared-types';
import type { AdapterApi } from '@/adapters/types/index.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database';
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
            const size = args.size || 300;

            const imagePath = path.join(
                CONSTANTS.CACHE_DIR(args.libraryId),
                size.toString(),
                args.id,
            );

            if (cache) {
                const isImageCached = await isCached(imagePath);

                if (isImageCached) {
                    const { buffer } = await imageModule.getBufferFromPath(imagePath);
                    return buffer;
                }
            }

            const url = adapter._getCoverArtUrl(args);
            const { buffer } = await imageModule.getBufferFromUrl(url);
            // const thumbHash = await imageModule.generateThumbHash(arrayBuffer);
            // db.thumbhash.insert(args.libraryId, args.id, thumbHash);
            const avifBuffer = await imageModule.convertToAvif(buffer);

            if (cache) {
                await cacheImage(imagePath, avifBuffer);
            }

            return avifBuffer;
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

async function isCached(imagePath: string) {
    return fs.exists(imagePath);
}

async function cacheImage(imagePath: string, buffer: Buffer) {
    // Check if image directory exists, if not create it
    const imageDir = path.dirname(imagePath);
    if (!(await fs.exists(imageDir))) {
        await fs.mkdir(imageDir, { recursive: true });
    }

    await fs.writeFile(imagePath, buffer);
}
