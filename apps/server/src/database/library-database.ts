import { LibraryType } from '@repo/shared-types';
import orderBy from 'lodash/orderBy.js';
import slice from 'lodash/slice.js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import type { DbOrderBy, DbPaginatedResult, DbResult } from '@/database/database-types.js';
import type { DatabaseModules } from '@/database/init-database.js';
import { initJsonDatabase } from '@/modules/json-database/index.js';
import { utils } from '../utils/index';

export const libraryTypeSchema = z.nativeEnum(LibraryType);

export const librarySchema = z.object({
    baseUrl: z.string(),
    createdAt: z.string(),
    displayName: z.string().max(30).nullable(),
    folders: z.array(
        z.object({
            id: z.string(),
            isEnabled: z.boolean(),
            name: z.string(),
        }),
    ),
    id: z.string(),
    scanCredential: z.string().nullable(),
    scanUsername: z.string().nullable(),
    type: z.nativeEnum(LibraryType),
    updatedAt: z.string(),
});

export type LibraryDatabaseSchema = {
    libraries: z.infer<typeof librarySchema>[];
};

export type DbLibrary = LibraryDatabaseSchema['libraries'][number];

export type DbLibraryInsert = Omit<
    LibraryDatabaseSchema['libraries'][number],
    'createdAt' | 'updatedAt'
>;

export type DbLibraryUpdate = Partial<DbLibraryInsert>;

export function initLibraryDatabase(modules: DatabaseModules) {
    const libraryDb = initJsonDatabase<LibraryDatabaseSchema>({
        default: { libraries: [] },
        name: 'libraries',
    });

    return {
        deleteById: (id: string): void => {
            const libraries = libraryDb.get('libraries');
            const newLibraries = libraries.filter((library) => library.id !== id);
            libraryDb.set('libraries', newLibraries);
        },
        findAll: (options: {
            limit?: number;
            offset?: number;
            orderBy?: DbOrderBy<DbLibrary>;
        }): DbPaginatedResult<DbLibrary> => {
            const libraries = libraryDb.get('libraries');
            const ordered = orderBy(libraries, options.orderBy || [['displayName', 'asc']]);

            if (options.limit) {
                const sliced = slice(ordered, options.offset || 0, options.limit);
                return [null, { data: sliced, totalRecordCount: ordered.length }];
            }

            if (options.offset) {
                const sliced = slice(ordered, options.offset, ordered.length);
                return [null, { data: sliced, totalRecordCount: ordered.length }];
            }

            return [null, { data: ordered, totalRecordCount: ordered.length }];
        },
        findById: (id: string): DbResult<DbLibrary | undefined> => {
            const libraries = libraryDb.get('libraries');
            const library = libraries.find((library) => library.id === id);
            return [null, library];
        },
        findByIdOrThrow: (id: string): DbResult<DbLibrary> => {
            const libraries = libraryDb.get('libraries');
            const library = libraries.find((library) => library.id === id);

            if (!library) {
                return [{ message: 'Library not found' }, null];
            }

            return [null, library];
        },
        insert: (library: DbLibraryInsert): DbResult<DbLibrary> => {
            const libraries = libraryDb.get('libraries');

            const inserted: DbLibrary = {
                ...library,
                createdAt: utils.date.now(),
                updatedAt: utils.date.now(),
            };

            const validate = librarySchema.safeParse(inserted);

            if (!validate.success) {
                const error = fromError(validate.error);
                return [{ message: error.toString() }, null];
            }

            libraryDb.set('libraries', [...libraries, inserted]);

            const [err, lib] = initLibraryDatabase(modules).findByIdOrThrow(inserted.id);

            if (err) {
                return [err, null];
            }

            return [null, lib];
        },
        updateById: (id: string, value: DbLibraryUpdate): DbResult<DbLibrary> => {
            const [err, existingLibrary] = initLibraryDatabase(modules).findByIdOrThrow(id);

            if (err) {
                return [err, null];
            }

            const newValue: DbLibrary = {
                ...existingLibrary,
                ...value,
                updatedAt: utils.date.now(),
            };

            const validate = librarySchema.safeParse(newValue);

            if (!validate.success) {
                const error = fromError(validate.error);
                return [{ message: error.toString() }, null];
            }

            libraryDb.set(`libraries.${id}`, newValue);
            return [null, newValue];
        },
    };
}
