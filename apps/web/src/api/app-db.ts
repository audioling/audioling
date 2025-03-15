import type { AlbumItem, ArtistItem, GenreItem, PlaylistItem, TrackItem } from '/@/app-types';
import type { AuthServer } from '@repo/shared-types/app-types';
import type { QueryOptions, SuspenseQueriesOptions } from '@tanstack/react-query';
import type { DBSchema } from 'idb';
import { ServerItemType } from '@repo/shared-types/app-types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { openDB } from 'idb';
import { useEffect, useState } from 'react';
import { useAppContext } from '/@/features/authentication/context/app-context';

interface AppDBSchema extends DBSchema {
    [ServerItemType.ALBUM_ARTIST]: {
        key: string;
        value: ArtistItem;
    };
    [ServerItemType.ALBUM]: {
        key: string;
        value: AlbumItem;
    };
    [ServerItemType.ARTIST]: {
        key: string;
        value: ArtistItem;
    };
    [ServerItemType.GENRE]: {
        key: string;
        value: GenreItem;
    };
    [ServerItemType.PLAYLIST]: {
        key: string;
        value: PlaylistItem;
    };
    [ServerItemType.TRACK]: {
        key: string;
        value: TrackItem;
    };
    [ServerItemType.QUEUE_TRACK]: {
        key: string;
        value: TrackItem;
    };
}

type AppDBTypeValue = ArtistItem | AlbumItem | ArtistItem | GenreItem | PlaylistItem | TrackItem;

export type AppDB = ReturnType<typeof initAppDB>;

export type AppDBType =
    | ServerItemType.ALBUM_ARTIST
    | ServerItemType.ALBUM
    | ServerItemType.ARTIST
    | ServerItemType.GENRE
    | ServerItemType.PLAYLIST
    | ServerItemType.TRACK;

export function initAppDB(opts: { serverId: string }) {
    const { serverId } = opts;

    const dbPromise = openDB<AppDBSchema>(`audioling-${serverId}`, 1, {
        upgrade(db) {
            db.createObjectStore(ServerItemType.ALBUM_ARTIST);
            db.createObjectStore(ServerItemType.ALBUM);
            db.createObjectStore(ServerItemType.ARTIST);
            db.createObjectStore(ServerItemType.GENRE);
            db.createObjectStore(ServerItemType.PLAYLIST);
            db.createObjectStore(ServerItemType.TRACK);
            db.createObjectStore(ServerItemType.QUEUE_TRACK);
        },
    });

    const db = {
        clear: async (db: AppDBType) => {
            return (await dbPromise).clear(db);
        },
        delete: async (db: AppDBType, key: string) => {
            return (await dbPromise).delete(db, key);
        },
        exists: async (db: AppDBType, key: string) => {
            const result = await (await dbPromise).getKey(db, key);
            return result !== undefined;
        },
        get: async (db: AppDBType, key: string) => {
            return (await dbPromise).get(db, key);
        },
        getCount: async (db: AppDBType) => {
            return (await dbPromise).count(db);
        },
        getKeys: async (db: AppDBType) => {
            return (await dbPromise).getAllKeys(db);
        },
        getMany: async (db: AppDBType, keys: string[]) => {
            const tx = (await dbPromise).transaction(db, 'readonly');
            const store = tx.store;

            const promises = keys.map(key => store.get(key));

            const results = await Promise.all(promises);
            await tx.done;
            return results.filter(item => item !== undefined);
        },
        iterate: async (
            db: AppDBType,
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
            db: AppDBType,
            value: {
                key: string;
                value: unknown;
            },
        ) => {
            return (await dbPromise).put(db, value.value as AppDBTypeValue, value.key);
        },
        setBatch: async (db: AppDBType, values: { key: string; value: unknown }[]) => {
            const tx = (await dbPromise).transaction(db, 'readwrite');

            const promises: Promise<string | void>[] = values.map(({ key, value }) =>
                tx.store.put(value as AppDBTypeValue, key),
            );

            promises.push(tx.done);

            await Promise.all(promises);
        },
    };

    return db;
}

export const appDBTypeMap = {
    [ServerItemType.ALBUM_ARTIST]: ServerItemType.ALBUM_ARTIST,
    [ServerItemType.ALBUM]: ServerItemType.ALBUM,
    [ServerItemType.ARTIST]: ServerItemType.ARTIST,
    [ServerItemType.GENRE]: ServerItemType.GENRE,
    [ServerItemType.PLAYLIST]: ServerItemType.PLAYLIST,
    [ServerItemType.TRACK]: ServerItemType.TRACK,
    [ServerItemType.QUEUE_TRACK]: ServerItemType.TRACK,
    [ServerItemType.PLAYLIST_TRACK]: ServerItemType.TRACK,
};

export function useAppDB(server: AuthServer | null) {
    const [appDB, setAppDB] = useState<AppDB | null>(null);

    useEffect(() => {
        function setupAppDB() {
            if (server === null) {
                setAppDB(null);
                return;
            }

            setAppDB(initAppDB({ serverId: server.id }));
        }

        setupAppDB();

        return () => {
            setAppDB(null);
        };
    }, [server]);

    return appDB;
}

export function getAppDBItemQueryKey(server: AuthServer, type: AppDBType, id?: string) {
    if (!id) {
        return [server.id, 'app-db', type];
    }

    return [server.id, 'app-db', type, id];
}

export function useAppDBItem(type: AppDBType, id: string | undefined, options?: QueryOptions) {
    const { appDB, server } = useAppContext();

    const query = useQuery({
        enabled: !!id,
        queryFn: () => {
            return appDB.get(type, id as string);
        },
        queryKey: getAppDBItemQueryKey(server, type, id),
        ...options,
    });

    return query;
}

export function useSuspenseAppDBItem<T extends any[]>(
    type: AppDBType,
    id: string,
    options?: SuspenseQueriesOptions<T>,
) {
    const { appDB, server } = useAppContext();

    return useSuspenseQuery({
        queryFn: () => {
            return appDB.get(type, id);
        },
        queryKey: getAppDBItemQueryKey(server, type, id),
        ...options,
    });
}

export async function getDBItems(appDB: AppDB, type: AppDBType, ids: string[], cb?: (items: unknown[]) => void) {
    const batchSize = 5000;
    const batches = [];
    for (let i = 0; i < ids.length; i += batchSize) {
        batches.push(ids.slice(i, i + batchSize));
    }

    // Process each batch concurrently
    const results = await Promise.all(batches.map(batchIds => appDB?.getMany(type, batchIds)));

    // Flatten the results from all batches
    const items = results.flat();

    if (cb) {
        return cb(items);
    }

    return items;
}
