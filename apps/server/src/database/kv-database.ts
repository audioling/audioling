import { z } from 'zod';
import type { DbResult } from '@/database/database-types.js';
import type { DatabaseModules } from '@/database/init-database.js';
import { initJsonDatabase } from '@/modules/json-database/index.js';

export const kvSchema = z.record(z.string(), z.string());

type KvDatabaseSchema = {
    kv: z.infer<typeof kvSchema>;
};

export type DbKv = KvDatabaseSchema['kv'][number];

export type DbKvInsert = DbKv;

export type DbKvUpdate = Partial<DbKvInsert>;

export function initKvDatabase(modules: DatabaseModules) {
    const kvDb = initJsonDatabase<KvDatabaseSchema>({
        default: { kv: {} },
        name: 'kv',
    });

    return {
        deleteById: (id: string): void => {
            const kv = kvDb.get('kv');
            delete kv[id];
            kvDb.set('kv', kv);
        },
        deleteByIncludes: (str: string): void => {
            const kv = kvDb.get('kv');
            Object.keys(kv).forEach((key) => {
                if (key.includes(str)) {
                    delete kv[key];
                }
            });

            kvDb.set('kv', kv);
        },
        findAll: (): DbResult<KvDatabaseSchema['kv']> => {
            const kv = kvDb.get('kv');
            return [null, kv];
        },
        findById: (id: string): DbResult<DbKv | undefined> => {
            const kv = kvDb.get('kv');
            const item = kv?.[id];
            return [null, item];
        },
        findByIdOrThrow: (id: string): DbResult<DbKv> => {
            const kv = kvDb.get('kv');
            const item = kv?.[id];

            if (!item) {
                return [{ message: 'Kv id not found' }, null];
            }

            return [null, item];
        },
        insert: (key: DbKvInsert, value: string): DbResult<DbKv> => {
            const kv = kvDb.get('kv');
            kv[key] = value;
            kvDb.set('kv', kv);
            return initKvDatabase(modules).findByIdOrThrow(key);
        },
        updateById: (key: string, value: DbKvUpdate): DbResult<DbKv> => {
            const kv = kvDb.get('kv');
            kv[key] = value;
            kvDb.set('kv', kv);
            return [null, value];
        },
    };
}
