import { LibraryType, SubsonicLibraryFeatures } from '@repo/shared-types';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { AuthUser } from '@/api/api-types.ts';

export type AuthLibrary = {
    credential: string | null;
    overrideBaseUrl: string | null;
    type: LibraryType | null;
    username: string | null;
};

type State = {
    baseUrl: string | null;
    libraries: Record<string, AuthLibrary>;
    selectedLibraryId: string | null;
    user: AuthUser | null;
};

type Actions = {
    invalidateLibrary: (id: string) => void;
    removeLibrary: (id: string) => void;
    setLibrary: (id: string, values: Partial<AuthLibrary>) => void;
    setSelectedLibrary: (id: string | null) => void;
    signIn: (user: AuthUser, baseUrl: string) => void;
    signOut: () => void;
    signOutLibrary: () => void;
};

export type AuthSlice = State & Actions;

export const useAuthStore = create<State & Actions>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((set) => ({
                    baseUrl: null,
                    invalidateLibrary: (id) => {
                        set((state) => {
                            state.libraries[id].credential = null;
                            state.libraries[id].username = null;
                        });
                    },
                    libraries: {},
                    removeLibrary: (id) => {
                        set((state) => {
                            delete state.libraries[id];
                        });
                    },
                    selectedLibraryId: null,
                    setLibrary: (id, values) => {
                        set((state) => {
                            if (!state.libraries[id]) {
                                state.libraries[id] = {
                                    credential: null,
                                    overrideBaseUrl: null,
                                    type: null,
                                    username: null,
                                };
                            }

                            state.selectedLibraryId = id;
                            state.libraries[id].credential =
                                values.credential || state.libraries[id].credential || null;
                            state.libraries[id].overrideBaseUrl =
                                values.overrideBaseUrl ||
                                state.libraries[id].overrideBaseUrl ||
                                null;
                            state.libraries[id].username =
                                values.username || state.libraries[id].username || null;
                        });
                    },
                    setSelectedLibrary: (id) => {
                        set((state) => {
                            state.selectedLibraryId = id;
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
                            state.selectedLibraryId = null;
                        });
                    },
                    signOutLibrary: () => {
                        set((state) => {
                            state.selectedLibraryId = null;
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

export const useIsAdmin = () => {
    return useAuthStore((state) => Boolean(state.user?.isAdmin));
};

export const useAuthSignIn = () => {
    return useAuthStore((state) => state.signIn);
};

export const useAuthSignOut = () => {
    return useAuthStore((state) => state.signOut);
};

export const useLibrarySignOut = () => {
    return useAuthStore((state) => state.signOutLibrary);
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

export const useInvalidateAuthLibrary = () => {
    return useAuthStore((state) => state.invalidateLibrary);
};

export const useAuthLibrary = (id: string): AuthLibrary | null => {
    return useAuthStore((state) => state.libraries[id]);
};

export const useRemoveAuthLibrary = () => {
    return useAuthStore((state) => state.removeLibrary);
};

export const useSelectedLibraryId = () => {
    return useAuthStore((state) => state.selectedLibraryId);
};

export const useSelectedLibrary = () => {
    return useAuthStore((state) =>
        state.selectedLibraryId ? state.libraries[state.selectedLibraryId] : null,
    );
};

export const useSetSelectedLibrary = () => {
    return useAuthStore((state) => state.setSelectedLibrary);
};

export const useAuthBaseUrl = () => {
    return useAuthStore((state) => state.baseUrl) || '';
};

export const useLibraryFeatures = (id: string) => {
    const library = useAuthStore((state) => state.libraries[id]);

    switch (library?.type) {
        case LibraryType.SUBSONIC:
            return SubsonicLibraryFeatures;
        default:
            return SubsonicLibraryFeatures;
    }
};
