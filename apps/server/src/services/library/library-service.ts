import type { LibraryType } from '@repo/shared-types';
import { LibraryListSortOptions } from '@repo/shared-types';
import { authenticationAdapter, initRemoteAdapter } from '@/adapters/index.js';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database.js';
import type { DbLibrary, DbLibraryInsert } from '@/database/library-database.js';
import { writeLog } from '@/middlewares/logger-middleware.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { IdFactoryModule } from '@/modules/id/index.js';
import type {
    DeleteByIdServiceArgs,
    FindByIdServiceArgs,
    FindManyServiceArgs,
    InsertServiceArgs,
    UpdateByIdServiceArgs,
} from '@/services/service-helpers.js';

// SECTION - Library Service
export const initLibraryService = (modules: { db: AppDatabase; idFactory: IdFactoryModule }) => {
    const { db, idFactory } = modules;

    return {
        // ANCHOR - Add
        add: async (
            args: InsertServiceArgs<
                Omit<DbLibraryInsert, 'folders' | 'scanCredential' | 'scanUsername'>
            > & {
                password: string;
                username: string;
            },
        ) => {
            const cleanBaseUrl = args.values.baseUrl.replace(/\/$/, '');

            const authResult = await authenticationAdapter(
                args.values.type as LibraryType,
            )?.authenticate(cleanBaseUrl, {
                password: args.password,
                username: args.username,
            });

            if (authResult === null) {
                throw new apiError.badRequest({
                    message: `Failed to authenticate to ${cleanBaseUrl}`,
                });
            }

            const id = idFactory.generate();

            const libraryWithoutFolders: Omit<DbLibraryInsert, 'folders'> = {
                baseUrl: cleanBaseUrl,
                displayName: args.values.displayName,
                id,
                scanCredential: authResult.auth.credential,
                scanUsername: authResult.auth.username,
                tokens: {},
                type: args.values.type,
            };

            const adapter = initRemoteAdapter(
                db,
                { ...libraryWithoutFolders, createdAt: '', folders: [], updatedAt: '' },
                authResult.auth,
            );

            const [foldersErr, folders] = await adapter.getMusicFolderList({
                query: {
                    limit: 500,
                    offset: 0,
                },
            });

            if (foldersErr) {
                throw new apiError.internalServer({ message: foldersErr.message });
            }

            const library: DbLibraryInsert = {
                ...libraryWithoutFolders,
                folders: folders.items.map((item) => ({
                    id: String(item.id),
                    isEnabled: true,
                    name: item.name,
                })),
            };

            const [err, result] = db.library.insert(library);

            if (err) {
                throw new apiError.internalServer({ message: 'Failed to create library' });
            }

            writeLog.info(`Library ${args.values.baseUrl}@${id} created`);

            return result;
        },
        // ANCHOR - Authenticate
        authenticate: async (
            args: FindByIdServiceArgs & { body: { password: string; username: string } },
        ) => {
            const library = await initLibraryService(modules).detail({ id: args.id });

            if (!library) {
                throw new apiError.notFound({ message: 'Library not found' });
            }

            const authResult = await authenticationAdapter(library.type).authenticate(
                library.baseUrl,
                {
                    password: args.body.password,
                    username: args.body.username,
                },
            );

            if (authResult === null) {
                throw new apiError.badRequest({
                    message: `Failed to authenticate to ${library.baseUrl}`,
                });
            }

            return {
                credential: authResult.auth.credential,
                type: library.type,
                username: authResult.auth.username,
            };
        },
        // ANCHOR - Detail
        detail: async (args: FindByIdServiceArgs) => {
            const [err, result] = db.library.findById(args.id);

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            if (!result) {
                throw new apiError.notFound({ message: 'Library not found' });
            }

            return result;
        },
        // ANCHOR - List
        list: async (args: FindManyServiceArgs<LibraryListSortOptions>) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            let sortField: keyof DbLibrary = 'displayName';

            switch (args.sortBy) {
                case LibraryListSortOptions.NAME:
                    sortField = 'displayName';
                    break;
                case LibraryListSortOptions.TYPE:
                    sortField = 'type';
                    break;
                case LibraryListSortOptions.CREATED_AT:
                    sortField = 'createdAt';
                    break;
                case LibraryListSortOptions.UPDATED_AT:
                    sortField = 'updatedAt';
                    break;
                default:
                    sortField = 'displayName';
            }

            const [err, result] = db.library.findAll({
                limit,
                offset,
                orderBy: [[sortField, args.sortOrder]],
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return {
                data: result.data,
                limit,
                offset,
                totalRecordCount: result.totalRecordCount,
            };
        },
        // ANCHOR - Refresh
        refresh: async (args: FindByIdServiceArgs) => {
            const library = await initLibraryService(modules).detail({ id: args.id });

            if (!library) {
                throw new apiError.notFound({ message: 'Library not found' });
            }

            if (!library.scanCredential || !library.scanUsername) {
                throw new apiError.badRequest({ message: 'Library scan credentials not found' });
            }

            const adapter = initRemoteAdapter(db, library, {
                credential: library.scanCredential,
                username: library.scanUsername,
            });

            const [foldersErr, folders] = await adapter.getMusicFolderList({
                query: {
                    limit: 500,
                    offset: 0,
                },
            });

            if (foldersErr) {
                throw new apiError.internalServer({ message: foldersErr.message });
            }

            db.library.updateById(args.id, {
                folders: folders.items.map((item) => ({
                    id: item.id,
                    isEnabled: true,
                    name: item.name,
                })),
            });

            writeLog.info(`Library ${args.id} - ${library.baseUrl} was refreshed`);

            return library;
        },
        // ANCHOR - Remove
        remove: async (args: DeleteByIdServiceArgs) => {
            const result = await initLibraryService(modules).detail({ id: args.id });

            if (!result) {
                throw new apiError.notFound({ message: 'Library not found' });
            }

            db.library.deleteById(args.id);

            writeLog.info(`Library ${args.id} - ${result.baseUrl} was removed`);
        },
        // ANCHOR - Update
        update: async (
            args: UpdateByIdServiceArgs<{
                baseUrl: string;
                displayName: string;
                password: string;
                username: string;
            }>,
        ) => {
            const library = await initLibraryService(modules).detail({ id: args.id });

            const cleanBaseUrl = args.values.baseUrl.replace(/\/$/, '');

            const authResult = await authenticationAdapter(library.type)?.authenticate(
                cleanBaseUrl,
                {
                    password: args.values.password,
                    username: args.values.username,
                },
            );

            if (authResult === null) {
                throw new apiError.badRequest({
                    message: `Failed to authenticate to ${cleanBaseUrl}`,
                });
            }

            const [err, result] = db.library.updateById(args.id, args.values);

            if (err) {
                throw new apiError.internalServer({ message: 'Failed to update library' });
            }

            writeLog.info(`Library ${args.id} - ${result.baseUrl} was updated`);

            return result;
        },
    };
};

export type LibraryService = ReturnType<typeof initLibraryService>;
