import { UserListSortOptions } from '@repo/shared-types';
import bcrypt from 'bcryptjs';
import { CONSTANTS } from '@/constants.js';
import type { AppDatabase } from '@/database/init-database.js';
import type { DbUser, DbUserInsert, DbUserUpdate } from '@/database/user-database.js';
import { writeLog } from '@/middlewares/logger-middleware.js';
import { apiError } from '@/modules/error-handler/index.js';
import type { IdFactoryModule } from '@/modules/id/index.js';
import {
    type DeleteByIdServiceArgs,
    type FindByIdServiceArgs,
    type FindManyServiceArgs,
    type InsertServiceArgs,
    type UpdateByIdServiceArgs,
} from '@/services/service-helpers.js';

export const initUserService = (modules: { db: AppDatabase; idFactory: IdFactoryModule }) => {
    const { db, idFactory } = modules;

    return {
        add: async (args: InsertServiceArgs<DbUserInsert>) => {
            const id = idFactory.generate();
            const password = await bcrypt.hash(args.values.password, 10);

            const [err, isUserExists] = db.user.findByUsername(args.values.username);

            if (err) {
                throw new apiError.internalServer({
                    cause: err.message,
                    message: 'Failed to create user',
                });
            }

            if (isUserExists) {
                throw new apiError.conflict({ message: 'User already exists' });
            }

            db.user.insert({
                ...args.values,
                id,
                password,
            });

            writeLog.info(`User ${args.values.username}@${id} created`);

            const result = await initUserService(modules).detail({ id });
            return result;
        },
        detail: async (args: FindByIdServiceArgs) => {
            const [err, result] = db.user.findById(args.id);

            if (err) {
                throw new apiError.internalServer({
                    cause: err.message,
                    message: 'Failed to find user',
                });
            }

            if (!result) {
                throw new apiError.notFound({ message: 'User not found' });
            }

            return result;
        },
        list: async (args: FindManyServiceArgs<UserListSortOptions>) => {
            const limit = args.limit ?? CONSTANTS.DEFAULT_PAGINATION_LIMIT;
            const offset = args.offset ?? 0;

            let sortField: keyof DbUser = 'displayName';

            switch (args.sortBy) {
                case UserListSortOptions.NAME:
                    sortField = 'displayName';
                    break;
                case UserListSortOptions.CREATED_AT:
                    sortField = 'createdAt';
                    break;
                case UserListSortOptions.UPDATED_AT:
                    sortField = 'updatedAt';
                    break;
                default:
                    sortField = 'displayName';
                    break;
            }

            const [err, users] = db.user.findAll({
                limit,
                offset,
                orderBy: [[sortField, args.sortOrder]],
            });

            if (err) {
                throw new apiError.internalServer({
                    cause: err.message,
                    message: 'Failed to find users',
                });
            }

            return {
                data: users.data,
                limit,
                offset,
                totalRecordCount: users.totalRecordCount,
            };
        },
        remove: async (args: DeleteByIdServiceArgs) => {
            const user = await initUserService(modules).detail({ id: args.id });

            if (!user) {
                throw new apiError.notFound({ message: 'User not found' });
            }

            db.user.deleteById(args.id);
            writeLog.info(`User ${user.username}@${user.id} deleted`);
        },
        update: async (args: UpdateByIdServiceArgs<DbUserUpdate>) => {
            const [err, result] = db.user.updateById(args.id, args.values);

            if (err) {
                throw new apiError.internalServer({
                    cause: err.message,
                    message: 'Failed to update user',
                });
            }

            if (!result) {
                throw new apiError.notFound({ message: 'User not found' });
            }

            writeLog.info(`User ${result.username}@${result.id} updated`);
            return result;
        },
    };
};

export type UserService = ReturnType<typeof initUserService>;
