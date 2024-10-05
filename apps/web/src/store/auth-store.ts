import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { AuthUser } from '@/api/api-types.ts';

type State = {
    user: AuthUser | null;
};

type Actions = {
    signIn: (user: AuthUser) => void;
};

export type AuthSlice = State & Actions;

export const useAuthStore = create<State & Actions>()(
    devtools(
        persist(
            immer((set) => ({
                signIn: (user) => {
                    set((state) => {
                        state.user = user;
                    });
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
