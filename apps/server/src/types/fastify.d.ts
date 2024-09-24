import type { DBUser } from '@/models/types.js';

declare module 'fastify' {
    interface PassportUser extends DBUser {}
}
