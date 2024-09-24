import type { AdapterVariables } from '@/middlewares/adapter-middleware.js';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';

export type GlobalVariables = {
    adapter: AdapterVariables;
    auth: AuthVariables;
};
