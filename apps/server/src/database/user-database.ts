import find from 'lodash/find.js';
import orderBy from 'lodash/orderBy.js';
import slice from 'lodash/slice.js';
import unset from 'lodash/unset.js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import type { DbPaginatedResult, DbResult } from '@/database/database-types.js';
import type { DatabaseModules } from '@/database/init-database.js';
import { initJsonDatabase } from '@/modules/json-database/index.js';
import { utils } from '@/utils/index.js';

export const userSchema = z.object({
    createdAt: z.string(),
    displayName: z.string().nullable(),
    id: z.string(),
    isAdmin: z.boolean(),
    isEnabled: z.boolean(),
    password: z.string(),
    tokens: z
        .object({
            id: z.string(),
            token: z.string(),
        })
        .array(),
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

export type DbUserTokenInsert = Omit<DbUserToken, 'createdAt' | 'updatedAt'>;

export type DbUserTokenUpdate = Partial<DbUserTokenInsert>;

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
            const users = userDb.get('users');
            const user = users?.[id];

            if (!user) {
                return [{ message: 'User not found' }, null];
            }

            return [null, user];
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
