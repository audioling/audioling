import { z } from 'zod';
import type { DbResult } from '@/database/database-types.js';
import { initJsonDatabase } from '@/modules/json-database/index.js';

export const thumbhashSchema = z.record(z.string(), z.string());

type ThumbhashDatabaseSchema = {
    thumbhash: {
        [libraryId: string]: {
            [id: string]: string;
        };
    };
};

export type DbThumbhash = ThumbhashDatabaseSchema['thumbhash'][string][string];

export type DbThumbhashLibrary = ThumbhashDatabaseSchema['thumbhash'][string];

export type DbThumbhashInsert = DbThumbhash;

export type DbThumbhashUpdate = Partial<DbThumbhashInsert>;

export function initThumbhashDatabase() {
    const thumbhashDb = initJsonDatabase<ThumbhashDatabaseSchema>({
        default: { thumbhash: {} },
        name: 'thumbhash',
    });

    return {
        deleteById: (libraryId: string, id: string): void => {
            thumbhashDb.delete(`thumbhash.${libraryId}.${id}`);
        },
        deleteByLibraryId: (libraryId: string): void => {
            thumbhashDb.delete(`thumbhash.${libraryId}`);
        },
        findAll: (): DbResult<ThumbhashDatabaseSchema['thumbhash']> => {
            const thumbhash = thumbhashDb.get('thumbhash');
            return [null, thumbhash];
        },
        findById: (libraryId: string, id: string): DbResult<DbThumbhash | undefined> => {
            const thumbhash = thumbhashDb.get(`thumbhash.${libraryId}.${id}`) as unknown;
            return [null, thumbhash as DbThumbhash | undefined];
        },
        findByIdOrThrow: (libraryId: string, id: string): DbResult<DbThumbhash> => {
            const thumbhash: unknown = thumbhashDb.get(`thumbhash.${libraryId}.${id}`);

            if (!thumbhash) {
                return [{ message: 'Thumbhash id not found' }, null];
            }

            return [null, thumbhash as DbThumbhash];
        },
        findByLibraryId: (libraryId: string): DbResult<DbThumbhashLibrary | undefined> => {
            const thumbhash: unknown = thumbhashDb.get(`thumbhash.${libraryId}`);
            return [null, thumbhash as DbThumbhashLibrary | undefined];
        },
        insert: (libraryId: string, id: string, thumbhash: string): DbResult<DbThumbhash> => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (thumbhashDb as any).set(`thumbhash.${libraryId}.${id}`, thumbhash);
            return [null, thumbhash as DbThumbhash];
        },
        updateById: (libraryId: string, id: string, thumbhash: string): DbResult<DbThumbhash> => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (thumbhashDb as any).set(`thumbhash.${libraryId}.${id}`, thumbhash);
            return [null, thumbhash as DbThumbhash];
        },
    };
}
