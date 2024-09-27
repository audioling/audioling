import { LibraryType } from '@repo/shared-types';
import {
    initSubsonicAdapter,
    subsonicAuthenticationAdapter,
} from '@/adapters/subsonic/subsonic-adapter.js';
import type { AdapterApi, AdapterAuthentication } from '@/adapters/types/index.js';
import type { AppDatabase } from '@/database/init-database.js';
import type { DbLibrary } from '@/database/library-database.js';

export const authenticationAdapter = (type: LibraryType): AdapterAuthentication => {
    switch (type) {
        case LibraryType.SUBSONIC:
            return subsonicAuthenticationAdapter;
    }

    return subsonicAuthenticationAdapter;
};

export const initRemoteAdapter = (
    db: AppDatabase,
    library: DbLibrary,
    user: { credential: string; username: string },
): AdapterApi => {
    const libraryWithCreds = {
        ...library,
        scanCredential: user.credential,
        scanUsername: user.username,
    };

    switch (library.type) {
        case LibraryType.SUBSONIC:
            return initSubsonicAdapter(libraryWithCreds, db);

        default:
            return initSubsonicAdapter(libraryWithCreds, db);
    }
};
