import { LibraryItemType } from '@repo/shared-types';
import { z } from 'zod';
import { stringNumberSchema } from '@/controllers/shared-api-types.js';

export const imageDetailRequestSchema = z.object({
    size: stringNumberSchema.optional(),
    type: z.nativeEnum(LibraryItemType),
});

export type ImageDetailRequest = z.infer<typeof imageDetailRequestSchema>;
