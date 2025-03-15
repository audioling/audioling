import { type AuthServer, SERVER_CONFIG, type ServerType } from '@repo/shared-types/app-types';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '/@/lib/zustand';

interface State {
    serverId: string | null;
    servers: Record<string, AuthServer>;
}

interface Actions {
    getSelectedServer: () => AuthServer | null;
    invalidateServer: (id: string) => void;
    removeServer: (id: string) => void;
    setSelectedServer: (id: string | null) => void;
    signIn: (id: string | null, args: {
        baseUrl: string;
        credential: string;
        displayName?: string;
        serverType: ServerType;
        username: string;
    }) => void;
    signInServer: (id: string, args: {
        credential: string;
        username: string;
    }) => void;
    signOut: (id: string | null) => void;
    updateServer: (id: string, values: Partial<AuthServer>) => void;
}

export type AuthSlice = State & Actions;

export const useAuthStoreBase = create<State & Actions>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer((set, get) => ({
                    baseUrl: null,
                    getSelectedServer: () => {
                        const serverId = get().serverId;

                        if (!serverId) {
                            return null;
                        }

                        return get().servers[serverId];
                    },
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
                    signIn: (id, args) => {
                        set((state) => {
                            if (id) {
                                state.servers[id].user = {
                                    credential: args.credential,
                                    username: args.username,
                                };

                                state.serverId = id;
                            }
                            else {
                                const newId = nanoid();

                                state.servers[newId] = {
                                    baseUrl: args.baseUrl,
                                    displayName: args.displayName || args.baseUrl,
                                    features: SERVER_CONFIG[args.serverType].features,
                                    id: newId,
                                    type: args.serverType,
                                    user: {
                                        credential: args.credential,
                                        username: args.username,
                                    },
                                };

                                state.serverId = newId;
                            }
                        });
                    },
                    signInServer: (id, args) => {
                        set((state) => {
                            state.servers[id].user = {
                                credential: args.credential,
                                username: args.username,
                            };
                        });
                    },
                    signOut: () => {
                        set((state) => {
                            state.serverId = null;
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
        return null;
    }

    return servers[serverId];
}

export function useAuthServerById(id: string) {
    const servers = useAuthStore.use.servers();
    return servers[id];
}

export function getAuthServerById(id: string) {
    const servers = useAuthStore.getState().servers;
    return servers[id];
}
