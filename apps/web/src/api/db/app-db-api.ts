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
