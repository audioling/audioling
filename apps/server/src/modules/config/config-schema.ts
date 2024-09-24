import { z } from 'zod';
import { generateRandomString } from '@/utils/random-string.js';

export const appConfigSchema = z.object({
    logLevel: z.string().default('info'),
    openApi: z.boolean().default(false),
    port: z.number().default(4544),
    registrationAllowed: z.boolean().default(false),
    tokenSecret: z.string().default(generateRandomString(16)),
});

export type AppConfig = z.infer<typeof appConfigSchema>;
