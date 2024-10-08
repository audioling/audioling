import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { AuthUser } from '@/api/api-types.ts';

export type AuthLibrary = {
    baseUrl: string | null;
    credential: string | null;
    displayName: string;
    id: string;
    overrideBaseUrl: string | null;
    username: string | null;
};

type State = {
    baseUrl: string | null;
    libraries: Record<string, AuthLibrary>;
    user: AuthUser | null;
};

type Actions = {
    removeLibrary: (id: string) => void;
    setLibrary: (library: AuthLibrary) => void;
    signIn: (user: AuthUser, baseUrl: string) => void;
    signOut: () => void;
};

export type AuthSlice = State & Actions;

export const useAuthStore = create<State & Actions>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((set) => ({
                    baseUrl: null,
                    libraries: {},
                    removeLibrary: (id) => {
                        set((state) => {
                            delete state.libraries[id];
                        });
                    },
                    setLibrary: (library) => {
                        set((state) => {
                            state.libraries[library.id] = library;
                        });
                    },
                    signIn: (user, baseUrl) => {
                        set((state) => {
                            state.user = user;
                            state.baseUrl = baseUrl;
                        });
                    },
                    signOut: () => {
                        set((state) => {
                            state.user = null;
                            state.baseUrl = null;
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

export const useAuthLibraries = () => {
    return useAuthStore((state) => state.libraries);
};

export const useSetAuthLibrary = () => {
    return useAuthStore((state) => state.setLibrary);
};

export const useRemoveAuthLibrary = () => {
    return useAuthStore((state) => state.removeLibrary);
};
