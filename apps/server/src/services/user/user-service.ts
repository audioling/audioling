import bcrypt from 'bcryptjs';
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
} from '@/services/service-utils.js';

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
        list: async (args: FindManyServiceArgs<DbUser>) => {
            const [err, users] = db.user.findAll({
                limit: args.limit,
                offset: args.offset,
            });

            if (err) {
                throw new apiError.internalServer({
                    cause: err.message,
                    message: 'Failed to find users',
                });
            }

            return {
                data: users.data,
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
