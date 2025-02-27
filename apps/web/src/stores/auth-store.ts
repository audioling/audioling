import type { AuthServer } from '@repo/shared-types/app-types';
import { localize } from '@repo/localization';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '/@/lib/zustand';

interface AuthUser {
    credential: string;
    username: string;
}

interface State {
    baseUrl: string | null;
    serverId: string | null;
    servers: Record<string, AuthServer>;
}

interface Actions {
    invalidateServer: (id: string) => void;
    removeServer: (id: string) => void;
    setSelectedServer: (id: string | null) => void;
    signIn: (user: AuthUser, baseUrl: string) => void;
    signOut: () => void;
    signOutServer: (id: string) => void;
    updateServer: (id: string, values: Partial<AuthServer>) => void;
}

export type AuthSlice = State & Actions;

export const useAuthStoreBase = create<State & Actions>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer(set => ({
                    baseUrl: null,
                    invalidateServer: (id) => {
                        set((state) => {
                            state.servers[id].user = null;
                        });
                    },
                    removeServer: (id) => {
                        set((state) => {
                            delete state.servers[id];
                        });
                    },
                    serverId: null,
                    servers: {},
                    setSelectedServer: (id) => {
                        set((state) => {
                            state.serverId = id;
                        });
                    },
                    signIn: (user, baseUrl) => {
                        set((state) => {
                            const id = nanoid();

                            state.servers[id].user = user;
                            state.servers[id].baseUrl = baseUrl;
                        });
                    },
                    signOut: () => {
                        set((state) => {
                            state.serverId = null;
                        });
                    },
                    signOutServer: (id) => {
                        set((state) => {
                            state.servers[id].user = null;
                        });
                    },
                    updateServer: (id, values) => {
                        set((state) => {
                            state.servers[id] = {
                                ...state.servers[id],
                                ...values,
                            };
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

export const useAuthStore = createSelectors(useAuthStoreBase);

export function useAuthServer() {
    const serverId = useAuthStore.use.serverId();
    const servers = useAuthStore.use.servers();

    if (!serverId) {
        throw new Error(localize.t('errors.noServerSelected'));
    }

    return servers[serverId];
}
