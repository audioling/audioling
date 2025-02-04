import { useQuery } from '@tanstack/react-query';
import type { AppDbType } from '@/api/db/app-db.ts';
import { appDb } from '@/api/db/app-db.ts';

export function useAppDbItem(type: AppDbType, id: string) {
    const query = useQuery({
        queryFn: () => {
            if (!appDb) {
                throw new Error('AppDb is not initialized');
            }

            return appDb.get(type, id);
        },
        queryKey: ['app-db-item', type, id],
    });

    return query;
}

export async function getDbItem(type: AppDbType, id: string, cb?: (item: unknown) => void) {
    if (!appDb) {
        throw new Error('AppDb is not initialized');
    }

    if (cb) {
        return appDb.get(type, id).then((item) => {
            cb(item);
            return item;
        });
    }

    return appDb.get(type, id);
}

export async function getDbItems(type: AppDbType, ids: string[], cb?: (items: unknown[]) => void) {
    if (!appDb) {
        throw new Error('AppDb is not initialized');
    }

    if (cb) {
        const items = await Promise.all(ids.map((id) => appDb!.get(type, id)));
        return cb(items);
    }

    return Promise.all(ids.map((id) => appDb!.get(type, id)));
}
