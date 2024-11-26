import { LibraryType } from '@repo/shared-types';
import orderBy from 'lodash/orderBy.js';
import slice from 'lodash/slice.js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import type { DbOrderBy, DbPaginatedResult, DbResult } from '@/database/database-types.js';
import type { DatabaseModules } from '@/database/init-database.js';
import { initJsonDatabase } from '@/modules/json-database/index.js';
import { utils } from '../utils/index';

export enum DbLibraryTokenScope {
    IMAGES = 'images',
    STREAM = 'stream',
}

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
    tokens: z.record(z.string(), z.nativeEnum(DbLibraryTokenScope)),
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

export type DbLibraryToken = LibraryDatabaseSchema['libraries'][number]['tokens'][number];

export type DbLibraryTokenInsert = {
    scope: DbLibraryTokenScope;
    token: string;
};

export type DbLibraryTokenUpdate = Partial<DbLibraryTokenInsert>;

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
                tokens: {},
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
        token: {
            delete: (id: string, tokenId: string): DbResult<void> => {
                const library = libraryDb.get(`libraries.${id}`) as unknown;

                if (!library) {
                    return [{ message: 'Library not found' }, null];
                }

                delete (library as DbLibrary).tokens[tokenId];

                libraryDb.set(`libraries.${id}`, library as DbLibrary);

                return [null, undefined];
            },
            insert: (id: string, token: DbLibraryTokenInsert): DbResult<DbLibraryToken> => {
                const library = libraryDb.get(`libraries.${id}`) as unknown;

                if (!library) {
                    return [{ message: 'Library not found' }, null];
                }

                (library as DbLibrary).tokens[token.token] = token.scope;

                libraryDb.set(`libraries.${id}`, library as DbLibrary);

                return [null, token.token as DbLibraryTokenScope];
            },
            validate: (
                id: string,
                token: string,
                scope?: DbLibraryTokenScope,
            ): DbResult<boolean> => {
                const library = libraryDb.get(`libraries.${id}`) as unknown;

                if (!library) {
                    return [{ message: 'Library not found' }, null];
                }

                if (scope) {
                    if ((library as DbLibrary).tokens[token] !== scope) {
                        return [{ message: 'Invalid token scope' }, null];
                    }
                }

                return [null, true];
            },
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

            const libraries = libraryDb.get('libraries');

            const newLibraries = libraries.map((library) =>
                library.id === id ? newValue : library,
            );

            libraryDb.set('libraries', newLibraries);
            return [null, newValue];
        },
    };
}
