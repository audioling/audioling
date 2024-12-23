import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '@/lib/zustand.ts';

interface NavigationState {
    layout: {
        left: {
            open: boolean;
            size: number;
        };
        right: {
            open: boolean;
            size: number;
        };
    };
    scrollIndex: Record<string, number>;
    setLayout: (layout: Partial<NavigationState['layout']>) => void;
    setScrollIndex: (key: string, index: number) => void;
    setSection: (section: string) => (id: string, open?: boolean) => void;
    side: {
        general: Record<string, boolean>;
        playlists: Record<string, boolean>;
    };
    toggleRightPanel: () => void;
    toggleSection: (section: string) => (id: string) => void;
}

export const useNavigationStoreBase = create<NavigationState>()(
    persist(
        immer((set) => ({
            layout: {
                left: {
                    open: true,
                    size: 250,
                },
                right: {
                    open: true,
                    size: 300,
                },
            },
            scrollIndex: {},
            setLayout: (layout) => {
                set((state) => {
                    state.layout = { ...state.layout, ...layout };
                });
            },
            setScrollIndex: (key, index) => {
                set((state) => {
                    state.scrollIndex[key] = index;
                });
            },
            setSection: (section) => (id, open) => {
                set((state) => {
                    state.side[section as 'general' | 'playlists'][id] = Boolean(open);
                });
            },
            side: {
                general: {
                    library: true,
                    playlists: true,
                },
                playlists: {},
            },
            toggleRightPanel: () => {
                set((state) => {
                    state.layout.right.open = !state.layout.right.open;
                });
            },
            toggleSection: (section) => (id: string) => {
                set((state) => {
                    if (state.side[section as 'general' | 'playlists'][id]) {
                        state.side[section as 'general' | 'playlists'][id] = false;
                    } else {
                        state.side[section as 'general' | 'playlists'][id] = true;
                    }
                });
            },
        })),
        {
            name: 'navigation-store',
            version: 1,
        },
    ),
);

export const useNavigationStore = createSelectors(useNavigationStoreBase);
