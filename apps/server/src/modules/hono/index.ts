import { OpenAPIHono } from '@hono/zod-openapi';
import type { Env } from 'hono';
import { fromError } from 'zod-validation-error';
import { apiError } from '@/modules/error-handler/index.js';

export const newHono = <T extends Env>() =>
    new OpenAPIHono<T>({
        defaultHook: (result) => {
            if (result.success) {
                return;
            }

            throw new apiError.validation({ message: fromError(result.error).toString() });
        },
    });
