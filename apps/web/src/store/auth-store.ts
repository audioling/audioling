import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { mutative } from 'zustand-mutative';
import type { AuthServicePostAuthSignInMutationResult } from '@/api/queries/common.ts';

type State = {
    user: AuthServicePostAuthSignInMutationResult | null;
};

type Actions = {
    signIn: (user: AuthServicePostAuthSignInMutationResult) => void;
};

export type AuthSlice = State & Actions;

export const useAuthStore = create<State & Actions>()(
    devtools(
        persist(
            mutative((set) => ({
                signIn: (user) => {
                    set(() => ({
                        user: user.data,
                    }));
                },
                user: null,
            })),
            {
                name: 'auth-store',
                version: 1,
            },
        ),
        { name: 'auth-store' },
    ),
);

export const useAuthSignIn = () => {
    return useAuthStore((state) => state.signIn);
};

export const useAuthUser = () => {
    return useAuthStore((state) => state.user);
};
