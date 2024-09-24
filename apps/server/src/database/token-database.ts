import orderBy from 'lodash/orderBy.js';
import slice from 'lodash/slice.js';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import type { DbPaginatedResult, DbResult } from '@/database/database-types.js';
import type { DatabaseModules } from '@/database/init-database.js';
import { initJsonDatabase } from '@/modules/json-database/index.js';
import { utils } from '@/utils/index.js';

export const tokenSchema = z.object({
    createdAt: z.string(),
    id: z.string(),
    updatedAt: z.string(),
    userId: z.string(),
});

type TokenDatabaseSchema = {
    tokens: z.infer<typeof tokenSchema>[];
};

export type DbToken = TokenDatabaseSchema['tokens'][number];

export type DbTokenInsert = Omit<DbToken, 'createdAt' | 'updatedAt'>;

export type DbTokenUpdate = Partial<DbTokenInsert>;

export function initTokenDatabase(modules: DatabaseModules) {
    const tokenDb = initJsonDatabase<TokenDatabaseSchema>({
        default: { tokens: [] },
        name: 'tokens',
    });

    return {
        deleteById: (id: string): void => {
            const tokens = tokenDb.get('tokens');
            const newTokens = tokens.filter((user) => user.id !== id);
            tokenDb.set('tokens', newTokens);
        },
        deleteByUserId: (userId: string): void => {
            const tokens = tokenDb.get('tokens');
            const newTokens = tokens.filter((user) => user.userId !== userId);
            tokenDb.set('tokens', newTokens);
        },
        findAll: (
            args: {
                userId?: string;
            },
            options: {
                limit?: number;
                offset?: number;
                orderBy?: [keyof TokenDatabaseSchema['tokens'], 'asc' | 'desc'][];
            },
        ): DbPaginatedResult<DbToken> => {
            const users = tokenDb.get('tokens');
            const ordered = orderBy(users, options.orderBy || [['createdAt', 'asc']]);
            const filtered = args.userId
                ? ordered.filter((t) => t.userId === args.userId)
                : undefined;

            const toUse = filtered || ordered;

            if (options.limit) {
                const sliced = slice(toUse, options.offset || 0, options.limit);
                return [null, { data: sliced, totalRecordCount: ordered.length }];
            }

            if (options.offset) {
                const sliced = slice(toUse, options.offset || 0);
                return [null, { data: sliced, totalRecordCount: ordered.length }];
            }

            return [null, { data: toUse, totalRecordCount: ordered.length }];
        },
        findById: (id: string): DbResult<DbToken | undefined> => {
            const tokens = tokenDb.get('tokens');
            const token = tokens.find((t) => t.id === id);
            return [null, token];
        },
        findByIdOrThrow: (id: string): DbResult<DbToken> => {
            const tokens = tokenDb.get('tokens');
            const token = tokens.find((t) => t.id === id);

            if (!token) {
                return [{ message: 'Token not found' }, null];
            }

            return [null, token];
        },
        insert: (token: DbTokenInsert): DbResult<DbToken> => {
            const users = tokenDb.get('tokens');

            const inserted = {
                ...token,
                createdAt: utils.date.now(),
                updatedAt: utils.date.now(),
            };

            const validate = tokenSchema.safeParse(inserted);

            if (!validate.success) {
                const error = fromError(validate.error);
                return [{ message: error.toString() }, null];
            }

            tokenDb.set('tokens', [...users, inserted]);

            return initTokenDatabase(modules).findByIdOrThrow(inserted.id);
        },
        updateById: (id: string, value: DbTokenUpdate): DbResult<DbToken> => {
            const [err, existingToken] = initTokenDatabase(modules).findByIdOrThrow(id);

            if (err) {
                return [err, null];
            }

            const newValue: DbToken = {
                ...existingToken,
                ...value,
                updatedAt: utils.date.now(),
            };

            const validate = tokenSchema.safeParse(newValue);

            if (!validate.success) {
                const error = fromError(validate.error);
                return [{ message: error.toString() }, null];
            }

            tokenDb.set(`users.${id}`, newValue);
            return [null, newValue];
        },
    };
}
