import dayjs from 'dayjs';
import md5 from 'md5';
import stringify from 'safe-stable-stringify';
import type { AppDatabase } from '@/database/init-database.js';
import type { DbLibrary } from '@/database/library-database.js';
import { utils } from '@/utils/index.js';

const fetchLimit = 500;

const hashQuery = (query: Record<string, unknown>) => {
    const deterministicQuery = stringify(query);
    return md5(deterministicQuery);
};

const fetchTotalRecordCount = async (
    fetcher: (page: number, limit: number) => Promise<number>,
    fetchLimit?: number,
) => {
    const limit = fetchLimit || 500;

    const estimatedCount = await utils.estimateTotalRecordCount(fetcher, limit);
    const estimatedPages = Math.ceil(estimatedCount / limit);
    const totalRecordCount = await utils.exactTotalRecordCount(fetcher, estimatedPages, limit);
    return totalRecordCount;
};

const db = {
    getCount: async (
        db: AppDatabase,
        fetcher: (page: number, limit: number) => Promise<number>,
        options: {
            expiration?: number; // Expiration in minutes
            fetchLimit?: number;
            libraryId: string;
            query: Record<string, unknown>;
            type: 'album' | 'artist' | 'track' | 'playlist';
        },
    ) => {
        const hash = hashQuery(options.query);
        const key = `${options.libraryId}::${options.type}::${hash}`;
        const [, value] = db.kv.findById(key);

        if (!value) {
            const totalRecordCount = await fetchTotalRecordCount(fetcher, fetchLimit);
            const expiresAt = dayjs()
                .add(options.expiration || 1, 'minutes')
                .toISOString();
            db.kv.updateById(key, `${totalRecordCount}::${expiresAt}`);
            return totalRecordCount;
        }

        const [totalRecordCountFromDb, expiresAt] = value.split('::');

        if (value && dayjs().isAfter(dayjs(expiresAt))) {
            const totalRecordCount = await fetchTotalRecordCount(fetcher);
            const expiresAt = dayjs().add(1, 'day').toISOString();
            db.kv.updateById(key, `${totalRecordCount}::${expiresAt}`);
            return totalRecordCount;
        }

        return Number(totalRecordCountFromDb);
    },
    getCountWithoutFetch: (
        db: AppDatabase,
        options: {
            libraryId: string;
            query: Record<string, unknown>;
            type: 'album' | 'artist' | 'track' | 'playlist' | 'playlistDetail';
        },
    ) => {
        const hash = hashQuery(options.query);
        const key = `${options.libraryId}::${options.type}::${hash}`;
        const [, value] = db.kv.findById(key);

        if (!value) {
            return undefined;
        }

        const [totalRecordCountFromDb, expiresAt] = value.split('::');

        if (dayjs().isAfter(dayjs(expiresAt))) {
            return undefined;
        }

        return Number(totalRecordCountFromDb);
    },
    invalidateCount: (
        db: AppDatabase,
        options: {
            libraryId: string;
            query: Record<string, unknown>;
            type: 'album' | 'artist' | 'track' | 'playlist';
        },
    ) => {
        const hash = hashQuery(options.query);
        const key = `${options.libraryId}::${options.type}::${hash}`;
        db.kv.deleteById(key);
    },
    invalidateCountByLibraryId: (db: AppDatabase, libraryId: string) => {
        db.kv.deleteByIncludes(libraryId);
    },
    invalidateCountByType: (
        db: AppDatabase,
        options: {
            libraryId: string;
            type: 'album' | 'artist' | 'track' | 'playlist';
        },
    ) => {
        db.kv.deleteByIncludes(`${options.libraryId}::${options.type}`);
    },
    setCount: (
        db: AppDatabase,
        options: {
            count: number;
            expiration?: number;
            libraryId: string;
            query: Record<string, unknown>;
            type: 'album' | 'artist' | 'track' | 'playlist'; // Expiration in minutes
        },
    ) => {
        const hash = hashQuery(options.query);
        const key = `${options.libraryId}::${options.type}::${hash}`;
        const expiresAt = dayjs()
            .add(options.expiration || 60, 'minutes')
            .toISOString();
        db.kv.updateById(key, `${options.count}::${expiresAt}`);
    },
};

const adapterErrorMessage = (library: DbLibrary, route: string) => {
    return `Remote adapter ${library.baseUrl}@${library.id}@${library.type} failed on ${route}`;
};

export const adapterHelpers = {
    adapterErrorMessage,
    db,
};
