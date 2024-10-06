import { useEffect } from 'react';
import { subscribeAuthUser, useAuthUser } from '@/features/authentication/stores/auth-store.ts';

export const useAuthContext = () => {
    const user = useAuthUser();

    useEffect(() => {
        const unsubscribe = subscribeAuthUser(() => {});

        return unsubscribe;
    }, []);

    return user;
};
