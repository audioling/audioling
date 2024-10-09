import type { AuthUserPermissions } from '@repo/shared-types';
import { useAuthUser } from '@/features/authentication/stores/auth-store.ts';

export const useAuthPermissions = (): AuthUserPermissions => {
    const user = useAuthUser();

    const isAdmin = Boolean(user?.isAdmin);

    return {
        'library:add': isAdmin,
        'library:edit': isAdmin,
        'library:remove': isAdmin,
        'user:add': isAdmin,
        'user:edit': isAdmin,
        'user:remove': isAdmin,
    };
};
