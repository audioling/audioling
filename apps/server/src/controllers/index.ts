import { authApiSchema } from './auth/auth-api-schema.js';
import { libraryApiSchema } from './library/library-api-schema.js';
import { rootApiSchema } from './root/root-api-schema.js';
import { userApiSchema } from './user/user-api-schema.js';

export const apiSchema = {
    auth: authApiSchema,
    library: libraryApiSchema,
    root: rootApiSchema,
    user: userApiSchema,
};

export type ApiSchema = typeof apiSchema;
