import { LibraryItemType } from '@repo/shared-types';
import type { DBSchema } from 'idb';
import { openDB } from 'idb';
import type { AlbumItem, ArtistItem, GenreItem, PlaylistItem, TrackItem } from '@/api/api-types.ts';
import type { IndexStatus } from '@/features/shared/offline-filters/offline-filter-utils.ts';

interface AppDb extends DBSchema {
    [LibraryItemType.ALBUM_ARTIST]: {
        key: string;
        value: ArtistItem;
    };
    [LibraryItemType.ALBUM]: {
        key: string;
        value: AlbumItem;
    };
    [LibraryItemType.ARTIST]: {
        key: string;
        value: ArtistItem;
    };
    [LibraryItemType.GENRE]: {
        key: string;
        value: GenreItem;
    };
    [LibraryItemType.PLAYLIST]: {
        key: string;
        value: PlaylistItem;
    };
    [LibraryItemType.TRACK]: {
        key: string;
        value: TrackItem;
    };
    [LibraryItemType.QUEUE_TRACK]: {
        key: string;
        value: TrackItem;
    };
    indexes: {
        key: string;
        value: IndexStatus;
    };
}

type AppDbTypeValue = ArtistItem | AlbumItem | ArtistItem | GenreItem | PlaylistItem | TrackItem;

export let appDb: ReturnType<typeof initAppDb> | undefined = undefined;

export type AppDbType =
    | LibraryItemType.ALBUM_ARTIST
    | LibraryItemType.ALBUM
    | LibraryItemType.ARTIST
    | LibraryItemType.GENRE
    | LibraryItemType.PLAYLIST
    | LibraryItemType.TRACK
    | 'indexes';

export function initAppDb(opts: { libraryId: string }) {
    const { libraryId } = opts;

    const dbPromise = openDB<AppDb>(`audioling-${libraryId}`, 1, {
        upgrade(db) {
            db.createObjectStore(LibraryItemType.ALBUM_ARTIST);
            db.createObjectStore(LibraryItemType.ALBUM);
            db.createObjectStore(LibraryItemType.ARTIST);
            db.createObjectStore(LibraryItemType.GENRE);
            db.createObjectStore(LibraryItemType.PLAYLIST);
            db.createObjectStore(LibraryItemType.TRACK);
            db.createObjectStore(LibraryItemType.QUEUE_TRACK);
            db.createObjectStore('indexes');
        },
    });

    const db = {
        clear: async (db: AppDbType) => {
            return (await dbPromise).clear(db);
        },
        delete: async (db: AppDbType, key: string) => {
            return (await dbPromise).delete(db, key);
        },
        exists: async (db: AppDbType, key: string) => {
            const result = await (await dbPromise).getKey(db, key);
            return result !== undefined;
        },
        get: async (db: AppDbType, key: string) => {
            return (await dbPromise).get(db, key);
        },
        iterate: async (
            db: AppDbType,
            handlers: {
                onFinish?: () => void;
                onProgress: (items: unknown[]) => Promise<void>;
            },
            options?: {
                batchSize?: number;
            },
        ) => {
            const { onFinish, onProgress } = handlers;
            const { batchSize = 500 } = options ?? {};

            const tx = (await dbPromise).transaction(db, 'readwrite');
            const store = tx.store;
            let cursor = await store.openCursor();
            let batch: unknown[] = [];

            while (cursor) {
                batch.push(cursor.value);

                if (batch.length >= batchSize) {
                    await onProgress(batch);
                    batch = [];
                }

                cursor = await cursor.continue();
            }

            // Process any remaining items
            if (batch.length > 0) {
                await onProgress(batch);
            }

            if (onFinish) {
                onFinish();
            }
        },
        set: async (
            db: AppDbType,
            value: {
                key: string;
                value: unknown;
            },
        ) => {
            return (await dbPromise).put(db, value.value as AppDbTypeValue, value.key);
        },
        setBatch: async (db: AppDbType, values: { key: string; value: unknown }[]) => {
            const tx = (await dbPromise).transaction(db, 'readwrite');

            const promises: Promise<string | void>[] = values.map(({ key, value }) =>
                tx.store.put(value as AppDbTypeValue, key),
            );

            promises.push(tx.done);

            await Promise.all(promises);
        },
    };

    return db;
}

export function setAppDb(db: ReturnType<typeof initAppDb> | undefined) {
    appDb = db;
}

export const appDbTypeMap = {
    [LibraryItemType.ALBUM_ARTIST]: LibraryItemType.ALBUM_ARTIST,
    [LibraryItemType.ALBUM]: LibraryItemType.ALBUM,
    [LibraryItemType.ARTIST]: LibraryItemType.ARTIST,
    [LibraryItemType.GENRE]: LibraryItemType.GENRE,
    [LibraryItemType.PLAYLIST]: LibraryItemType.PLAYLIST,
    [LibraryItemType.TRACK]: LibraryItemType.TRACK,
    [LibraryItemType.QUEUE_TRACK]: LibraryItemType.TRACK,
    [LibraryItemType.PLAYLIST_TRACK]: LibraryItemType.TRACK,
    'track-index': 'track-index',
};
