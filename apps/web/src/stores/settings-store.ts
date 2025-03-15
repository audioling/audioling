import merge from 'lodash/merge';
import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import { createSelectors } from '/@/lib/zustand';

export enum LeftSidebarGroup {
    LIBRARY = 'library',
    PLAYLISTS = 'playlists',
}

export enum LibraryGroupItem {
    ARTISTS = 'artists',
    ALBUM_ARTISTS = 'albumArtists',
    ALBUMS = 'albums',
    TRACKS = 'tracks',
    FOLDERS = 'folders',
    GENRES = 'genres',
    HOME = 'home',
    PLAYLISTS = 'playlists',
}

export enum PlaylistGroupItem {
    CREATE_PLAYLIST = 'createPlaylist',
    PLAYLISTS = 'playlists',
}

interface State {
    itemsPerPage: number;
    layout: {
        left: {
            collapsed: boolean;
            expanded: string[];
            items: {
                [LeftSidebarGroup.LIBRARY]: LibraryGroupItem[];
                [LeftSidebarGroup.PLAYLISTS]: PlaylistGroupItem[];
            };
            open: boolean;
        };
        right: {
            open: boolean;
        };
        sizes: {
            main: number[];
        };
    };
}

interface Actions {
    setState: <Type, Path extends string[]>(path: [...Path], value: Type) => void;
}

export type AuthSlice = State & Actions;

const defaultSettings: State = {
    itemsPerPage: 100,
    layout: {
        left: {
            collapsed: false,
            expanded: [LeftSidebarGroup.LIBRARY, LeftSidebarGroup.PLAYLISTS],
            items: {
                [LeftSidebarGroup.LIBRARY]: [
                    LibraryGroupItem.HOME,
                    LibraryGroupItem.ALBUMS,
                    LibraryGroupItem.TRACKS,
                    LibraryGroupItem.ALBUM_ARTISTS,
                    LibraryGroupItem.GENRES,
                    LibraryGroupItem.FOLDERS,
                    LibraryGroupItem.PLAYLISTS,
                ],
                [LeftSidebarGroup.PLAYLISTS]: [PlaylistGroupItem.CREATE_PLAYLIST, PlaylistGroupItem.PLAYLISTS],
            },
            open: true,
        },
        right: {
            open: true,
        },
        sizes: {
            main: [250, 500, 250],
        },
    },
};

export const useSettingsStoreBase = create<State & Actions>()(
    devtools(
        persist(
            subscribeWithSelector(
                immer(set => ({
                    ...defaultSettings,
                    setState: (path, value) => {
                        set((state) => {
                            let current: unknown = state;
                            for (let i = 0; i < path.length - 1; i++) {
                                current = (current as Record<string, unknown>)[path[i]];
                            }
                            (current as Record<string, unknown>)[path[path.length - 1]] = value;
                        });
                    },
                })),
            ),
            {
                merge: (persistedState, currentState) => merge(currentState, persistedState),
                name: 'settings-store',
                version: 1,
            },
        ),
        { name: 'settings-store' },
    ),
);

export const useSettingsStore = createSelectors(useSettingsStoreBase);

export function useMainContentSize() {
    return useSettingsStoreBase(state => state.layout.sizes.main);
}

export function useLeftSidebarExpanded() {
    return useSettingsStoreBase(state => state.layout.left.expanded);
}

export function useMainContentOpenState() {
    return useSettingsStoreBase(useShallow(state => [state.layout.left.open, state.layout.right.open]));
}
