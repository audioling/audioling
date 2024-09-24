import { LibraryType } from '@repo/shared-types';
import {
    initSubsonicAdapter,
    subsonicAuthenticationAdapter,
} from '@/adapters/subsonic/subsonic-adapter.js';
import type { AdapterApi, AdapterAuthentication } from '@/adapters/types/index.js';
import type { DbLibrary } from '@/database/library-database.js';

export const authenticationAdapter = (type: LibraryType): AdapterAuthentication => {
    switch (type) {
        case LibraryType.SUBSONIC:
            return subsonicAuthenticationAdapter;
    }

    return subsonicAuthenticationAdapter;
};

export const initRemoteAdapter = (
    library: DbLibrary,
    user: { credential: string; username: string },
): AdapterApi => {
    switch (library.type) {
        case LibraryType.SUBSONIC:
            return initSubsonicAdapter(library, {
                credential: user.credential,
                username: user.username,
            });

        default:
            return initSubsonicAdapter(library, {
                credential: user.credential,
                username: user.username,
            });
    }
};
