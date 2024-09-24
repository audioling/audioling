import { createMiddleware } from 'hono/factory';
import { initRemoteAdapter } from '@/adapters/index.js';
import type { AdapterApi } from '@/adapters/types/index.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { LibraryService } from '@/services/library/library-service.js';

export type AdapterVariables = {
    adapter: AdapterApi;
};

type AdapterMiddlewareContext = {
    Variables: AdapterVariables;
};

export const adapterMiddleware = (libraryService: LibraryService) => {
    return createMiddleware<AdapterMiddlewareContext>(async (c, next) => {
        const libraryId = c.req.param('libraryId');

        if (!libraryId) {
            throw new apiError.badRequest({
                cause: 'Missing libraryId',
                message: 'Failed to initialize remote adapter',
            });
        }

        const library = await libraryService.detail({ id: libraryId });

        if (!library) {
            throw new apiError.badRequest({
                cause: 'Library not found',
                message: 'Failed to initialize remote adapter',
            });
        }

        if (!library.scanUsername || !library.scanCredential) {
            throw new apiError.badRequest({
                cause: 'Library credentials not found',
                message: 'Failed to initialize remote adapter',
            });
        }

        const adapter = initRemoteAdapter(library, {
            credential: library.scanCredential,
            username: library.scanUsername,
        });

        c.set('adapter', adapter);

        await next();
    });
};
