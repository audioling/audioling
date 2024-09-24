import { z } from '@hono/zod-openapi';
import { createIndividualResponseSchema } from '@/controllers/shared-api-types.js';
import { UserAttributes } from '@/controllers/user/user-api-types.js';

export const SignInRequestBodySchema = z.object({
    password: z.string().openapi({ example: 'admin' }),
    username: z.string().openapi({ example: 'admin' }),
});

export const SignInResponseSchema = createIndividualResponseSchema({
    attributes: UserAttributes.extend({
        token: z.object({
            id: z.string(),
            token: z.string(),
        }),
    }),
});

export type SignInResponse = z.infer<typeof SignInResponseSchema>;

export const SignOutRequestBodySchema = z.object({
    token: z.string().optional(),
});

export const RefreshResponseSchema = SignInResponseSchema;

export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

export const RegisterRequestBodySchema = SignInRequestBodySchema;

export const RegisterResponseSchema = z.null();

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
