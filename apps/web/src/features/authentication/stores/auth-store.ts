import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { AuthUser } from '@/api/api-types.ts';

type State = {
    user: AuthUser | null;
};

type Actions = {
    signIn: (user: AuthUser) => void;
    signOut: () => void;
};

export type AuthSlice = State & Actions;

export const useAuthStore = create<State & Actions>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((set) => ({
                    signIn: (user) => {
                        set((state) => {
                            state.user = user;
                        });
                    },
                    signOut: () => {
                        set((state) => {
                            state.user = null;
                        });
                    },
                    user: null,
                })),
            ),
            { name: 'auth-store', version: 1 },
        ),
        { name: 'auth-store' },
    ),
);

export const useAuthSignIn = () => {
    return useAuthStore((state) => state.signIn);
};

export const useAuthSignOut = () => {
    return useAuthStore((state) => state.signOut);
};

export const useAuthUser = () => {
    return useAuthStore((state) => state.user);
};

export const subscribeAuthUser = (callback: (user: AuthUser | null) => void) => {
    return useAuthStore.subscribe((state) => state.user, callback);
};
