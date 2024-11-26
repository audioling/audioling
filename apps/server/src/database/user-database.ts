/* eslint-disable @typescript-eslint/no-explicit-any */
import find from 'lodash/find.js';
import orderBy from 'lodash/orderBy.js';
import slice from 'lodash/slice.js';
import unset from 'lodash/unset.js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import type { DbPaginatedResult, DbResult } from '@/database/database-types.js';
import type { AppDatabase, DatabaseModules } from '@/database/init-database.js';
import { initJsonDatabase } from '@/modules/json-database/index.js';
import { utils } from '@/utils/index.js';

export enum DbUserTokenScope {
    FULL_ACCESS = 'full_access',
}

export const userSchema = z.object({
    config: z.object({
        private: z.object({}),
        public: z.object({
            playlistFolders: z
                .object({
                    createdAt: z.string(),
                    id: z.string(),
                    name: z.string(),
                    parentId: z.string().nullable(),
                    playlists: z.array(z.string()),
                    updatedAt: z.string(),
                })
                .array(),
        }),
    }),
    createdAt: z.string(),
    displayName: z.string().nullable(),
    id: z.string(),
    isAdmin: z.boolean(),
    isEnabled: z.boolean(),
    password: z.string(),
    tokens: z.record(z.string(), z.nativeEnum(DbUserTokenScope)),
    updatedAt: z.string(),
    username: z.string(),
});

export type UserDatabaseSchema = {
    users: Record<string, z.infer<typeof userSchema>>;
};

export type DbUser = UserDatabaseSchema['users'][number];

export type DbUserInsert = Omit<UserDatabaseSchema['users'][number], 'createdAt' | 'updatedAt'>;

export type DbUserUpdate = Partial<DbUserInsert>;

export type DbUserToken = UserDatabaseSchema['users'][number]['tokens'][number];

export type DbUserTokenInsert = {
    scope: DbUserTokenScope;
    token: string;
};

export type DbUserTokenUpdate = Partial<DbUserTokenInsert>;

export type DbUserConfig = UserDatabaseSchema['users'][number]['config'];

export type DbUserConfigPublic = DbUserConfig['public'];

export type DbUserConfigPrivate = DbUserConfig['private'];

export type DbUserPlaylistFolder = DbUserConfigPublic['playlistFolders'][number];

export type DbUserPlaylistFolderInsert = Omit<DbUserPlaylistFolder, 'createdAt' | 'updatedAt'>;

export type DbUserPlaylistFolderUpdate = Omit<Partial<DbUserPlaylistFolderInsert>, 'id'>;

export function initUserDatabase(modules: DatabaseModules) {
    const userDb = initJsonDatabase<UserDatabaseSchema>({
        default: { users: {} },
        name: 'users',
    });

    return {
        deleteById: (id: string): void => {
            const users = userDb.get('users');
            unset(users, id);
            userDb.set('users', users);
        },
        deleteByUsername: (username: string): void => {
            const users = userDb.get('users');
            const user = find(users, { username });

            if (user) {
                unset(users, user.id);
                userDb.set('users', users);
            }
        },
        findAll: (options: {
            limit?: number;
            offset?: number;
            orderBy?: [keyof UserDatabaseSchema['users'], 'asc' | 'desc'][];
        }): DbPaginatedResult<DbUser> => {
            const users = userDb.get('users');
            const ordered = orderBy(users, options.orderBy || [['createdAt', 'asc']]);

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
        findById: (id: string): DbResult<DbUser | undefined> => {
            const users = userDb.get('users');
            const user = users?.[id];

            return [null, user];
        },
        findByIdOrThrow: (id: string): DbResult<DbUser> => {
            const user = userDb.get(`users.${id}`);

            if (!user) {
                return [{ message: 'User not found' }, null];
            }

            return [null, user as unknown as DbUser];
        },
        findByUsername: (username: string): DbResult<DbUser | undefined> => {
            const users = userDb.get('users');
            const user = find(users, { username });
            return [null, user];
        },
        findByUsernameOrThrow: (username: string): DbResult<DbUser> => {
            const users = userDb.get('users');
            const user = find(users, { username });

            if (!user) {
                return [{ message: 'User not found' }, null];
            }

            return [null, user];
        },
        insert: (user: DbUserInsert): DbResult<DbUser> => {
            const users = userDb.get('users');

            const inserted = {
                ...user,
                createdAt: utils.date.now(),
                updatedAt: utils.date.now(),
            };

            const validate = userSchema.safeParse(inserted);

            if (!validate.success) {
                const error = fromError(validate.error);
                return [{ message: error.toString() }, null];
            }

            userDb.set('users', { ...users, [inserted.id]: inserted });

            return [null, inserted];
        },
        playlistFolder: {
            delete: (userId: string, playlistFolderId: string): DbResult<null> => {
                const [err, existingUser] = initUserDatabase(modules).findByIdOrThrow(userId);

                if (err) {
                    return [err, null];
                }

                const newPlaylistFolders = existingUser.config.public.playlistFolders.filter(
                    (folder) => folder.id !== playlistFolderId,
                );

                userDb.set(
                    `users.${userId}.config.public.playlistFolders`,
                    newPlaylistFolders as any,
                );

                return [null, null];
            },
            deletePlaylists: (
                userId: string,
                playlistFolderId: string,
                playlistIds: string[],
            ): DbResult<null> => {
                const [err, existingUser] = initUserDatabase(modules).findByIdOrThrow(userId);

                if (err) {
                    return [err, null];
                }

                const newPlaylistFolders = existingUser.config.public.playlistFolders.map(
                    (folder) =>
                        folder.id === playlistFolderId
                            ? {
                                  ...folder,
                                  playlists: folder.playlists.filter(
                                      (id) => !playlistIds.includes(id),
                                  ),
                              }
                            : folder,
                );

                userDb.set(
                    `users.${userId}.config.public.playlistFolders`,
                    newPlaylistFolders as any,
                );

                return [null, null];
            },
            findAll: (
                userId: string,
                options?: {
                    limit?: number;
                    offset?: number;
                    orderBy?: [
                        Omit<keyof DbUserPlaylistFolder, 'id' | 'playlists'>,
                        'asc' | 'desc',
                    ][];
                },
            ): DbResult<DbUserPlaylistFolder[]> => {
                const [err, existingUser] = initUserDatabase(modules).findByIdOrThrow(userId);

                if (err) {
                    return [err, null];
                }

                const folders = existingUser.config.public.playlistFolders;

                const ordered = orderBy(
                    folders,
                    (options?.orderBy as [keyof DbUserPlaylistFolder, 'asc' | 'desc'][]) || [
                        ['createdAt', 'asc'],
                    ],
                );

                if (options?.limit) {
                    return [null, slice(ordered, options.offset || 0, options.limit)];
                }

                if (options?.offset) {
                    return [null, slice(ordered, options.offset, ordered.length)];
                }

                return [null, folders];
            },
            findById: (
                userId: string,
                playlistFolderId: string,
            ): DbResult<DbUserPlaylistFolder | undefined> => {
                const [err, existingUser] = initUserDatabase(modules).findByIdOrThrow(userId);

                if (err) {
                    return [err, null];
                }

                return [
                    null,
                    find(existingUser.config.public.playlistFolders, { id: playlistFolderId }),
                ];
            },
            insert: (
                userId: string,
                playlistFolder: DbUserPlaylistFolderInsert,
            ): DbResult<DbUserPlaylistFolder> => {
                const [err, existingUser] = initUserDatabase(modules).findByIdOrThrow(userId);

                if (err) {
                    return [err, null];
                }

                const inserted: DbUserPlaylistFolder = {
                    ...playlistFolder,
                    createdAt: utils.date.now(),
                    updatedAt: utils.date.now(),
                };

                const newPlaylistFolders = [
                    ...existingUser.config.public.playlistFolders,
                    inserted,
                ];

                userDb.set(
                    `users.${userId}.config.public.playlistFolders`,
                    newPlaylistFolders as any,
                );

                return [null, inserted];
            },
            insertPlaylists: (
                userId: string,
                playlistFolderId: string,
                playlistIds: string[],
            ): DbResult<null> => {
                const [err, existingUser] = initUserDatabase(modules).findByIdOrThrow(userId);

                if (err) {
                    return [err, null];
                }

                // We need to map through all playlist folders and update the playlists array
                // for the playlist folder that matches the playlistFolderId

                const newPlaylistFolders = existingUser.config.public.playlistFolders.map(
                    (folder) => {
                        if (folder.id === playlistFolderId) {
                            return {
                                ...folder,
                                playlists: [...folder.playlists, ...playlistIds],
                                updatedAt: utils.date.now(),
                            };
                        }

                        // Filter the playlist id out of the remaining playlist folders
                        return {
                            ...folder,
                            playlists: folder.playlists.filter((id) => !playlistIds.includes(id)),
                        };
                    },
                );

                userDb.set(
                    `users.${userId}.config.public.playlistFolders`,
                    newPlaylistFolders as any,
                );

                return [null, null];
            },
            update: (
                userId: string,
                playlistFolderId: string,
                playlistFolder: DbUserPlaylistFolderUpdate,
            ): DbResult<DbUserPlaylistFolder> => {
                const [err, existingUser] = initUserDatabase(modules).findByIdOrThrow(userId);

                if (err) {
                    return [err, null];
                }

                const existing = existingUser.config.public.playlistFolders.find(
                    (folder) => folder.id === playlistFolderId,
                );

                if (!existing) {
                    return [{ message: 'Playlist folder not found' }, null];
                }

                const updated: DbUserPlaylistFolder = {
                    ...existing,
                    ...playlistFolder,
                    updatedAt: utils.date.now(),
                };

                const newPlaylistFolders = existingUser.config.public.playlistFolders.map(
                    (folder) => (folder.id === playlistFolderId ? updated : folder),
                );

                userDb.set(
                    `users.${userId}.config.public.playlistFolders`,
                    newPlaylistFolders as any,
                );

                return [null, updated];
            },
        },
        token: {
            delete: (id: string, tokenId: string): DbResult<void> => {
                const user = userDb.get(`users.${id}`) as unknown;

                if (!user) {
                    return [{ message: 'User not found' }, null];
                }

                delete (user as DbUser).tokens[tokenId];

                userDb.set(`users.${id}`, user as DbUser);

                return [null, undefined];
            },
            insert: (id: string, token: DbUserTokenInsert): DbResult<DbUserToken> => {
                const user = userDb.get(`users.${id}`) as unknown;

                if (!user) {
                    return [{ message: 'User not found' }, null];
                }

                (user as DbUser).tokens[token.token] = token.scope;

                userDb.set(`users.${id}`, user as DbUser);

                return [null, token.token as DbUserTokenScope];
            },
            validate: (id: string, token: string, scope?: DbUserTokenScope): DbResult<boolean> => {
                const user = userDb.get(`users.${id}`) as unknown;

                if (!user) {
                    return [{ message: 'User not found' }, null];
                }

                if (scope) {
                    if ((user as DbUser).tokens[token] !== scope) {
                        return [{ message: 'Invalid token scope' }, null];
                    }
                }

                return [null, true];
            },
        },
        updateById: (id: string, value: DbUserUpdate): DbResult<DbUser> => {
            const [err, existingUser] = initUserDatabase(modules).findByIdOrThrow(id);

            if (err) {
                return [err, null];
            }

            const newValue: DbUser = {
                ...existingUser,
                ...value,
                updatedAt: utils.date.now(),
            };

            const validate = userSchema.safeParse(newValue);

            if (!validate.success) {
                const error = fromError(validate.error);
                return [{ message: error.toString() }, null];
            }

            userDb.set(`users.${id}`, newValue);
            return [null, newValue];
        },
    };
}

export async function migrateUserConfig(db: AppDatabase): Promise<void> {
    const [err, users] = await db.user.findAll({});

    if (err) {
        throw err;
    }

    const updatePromises = users.data.map((user) => {
        if (!user.config) {
            user.config = {} as any;
        }

        // Ensure base structure exists
        if (!user?.config?.private) {
            user.config.private = {} as any;
        }

        if (!user?.config?.public) {
            user.config.public = {} as any;
        }

        // Ensure playlistFolders exists with default empty array
        if (!user?.config?.public?.playlistFolders) {
            user.config.public.playlistFolders = [];
        }

        return db.user.updateById(user.id, user);
    });

    await Promise.all(updatePromises);
}
