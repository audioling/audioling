import { useAuthUser } from '@/features/authentication/stores/auth-store.ts';

export type AuthUserPermissions = {
    'library:add': boolean;
    'library:edit': boolean;
    'library:remove': boolean;
    'user:add': boolean;
    'user:edit': boolean;
    'user:remove': boolean;
};

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
