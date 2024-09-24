import type { LibraryType } from '@repo/shared-types';
import { authenticationAdapter, initRemoteAdapter } from '@/adapters/index.js';
import type { AppDatabase } from '@/database/init-database.js';
import type { DbLibrary, DbLibraryInsert, DbLibraryUpdate } from '@/database/library-database.js';
import { writeLog } from '@/middlewares/logger-middleware.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { IdFactoryModule } from '@/modules/id/index.js';
import type {
    DeleteByIdServiceArgs,
    FindByIdServiceArgs,
    FindManyServiceArgs,
    InsertServiceArgs,
    UpdateByIdServiceArgs,
} from '@/services/service-utils.js';

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
                type: args.values.type,
            };

            const adapter = initRemoteAdapter(
                { ...libraryWithoutFolders, createdAt: '', folders: [], updatedAt: '' },
                authResult.auth,
            );

            const [foldersErr, folders] = await adapter.getMusicFolderList({
                query: null,
            });

            if (foldersErr) {
                throw new apiError.internalServer({ message: foldersErr.message });
            }

            const library: DbLibraryInsert = {
                ...libraryWithoutFolders,
                folders: folders.items.map((item) => ({
                    id: item.id,
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
        list: async (args: FindManyServiceArgs<DbLibrary>) => {
            const [err, result] = db.library.findAll({
                limit: args.limit,
                offset: args.offset,
                orderBy: [['createdAt', 'asc']],
            });

            if (err) {
                throw new apiError.internalServer({ message: err.message });
            }

            return {
                data: result.data,
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

            const adapter = initRemoteAdapter(library, {
                credential: library.scanCredential,
                username: library.scanUsername,
            });

            const [foldersErr, folders] = await adapter.getMusicFolderList({
                query: null,
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
        update: async (args: UpdateByIdServiceArgs<DbLibraryUpdate>) => {
            await initLibraryService(modules).detail({ id: args.id });

            const [err, result] = db.library.updateById(args.id, args.values);

            if (err) {
                throw new apiError.internalServer({ message: 'Failed to update library' });
            }

            if (!result) {
                throw new apiError.notFound({ message: 'Library not found' });
            }

            writeLog.info(`Library ${args.id} - ${result.baseUrl} was updated`);

            return result;
        },
    };
};

export type LibraryService = ReturnType<typeof initLibraryService>;
