import {
    RegisterRequestBodySchema,
    RegisterResponseSchema,
    SignInRequestBodySchema,
    SignInResponseSchema,
    SignOutRequestBodySchema,
} from '@/controllers/auth/auth-api-types.js';
import { EmptyResponseSchema, schemaResponse } from '@/controllers/shared-api-types.js';

export const authApiSchema = {
    '/register': {
        post: {
            request: {
                body: { content: { 'application/json': { schema: RegisterRequestBodySchema } } },
            },
            responses: schemaResponse(
                {
                    description: 'Register to an audioling server',
                    schema: RegisterResponseSchema,
                    status: 204,
                },
                [500],
            ),
        },
    },
    '/sign-in': {
        post: {
            request: {
                body: { content: { 'application/json': { schema: SignInRequestBodySchema } } },
            },
            responses: schemaResponse(
                {
                    description: 'Sign in to an audioling server',
                    schema: SignInResponseSchema,
                    status: 200,
                },
                [401, 500],
            ),
        },
    },
    '/sign-out': {
        post: {
            request: {
                body: { content: { 'application/json': { schema: SignOutRequestBodySchema } } },
            },
            responses: schemaResponse(
                {
                    description: 'Sign out from an audioling server',
                    schema: EmptyResponseSchema,
                    status: 204,
                },
                [401, 500],
            ),
        },
    },
};
