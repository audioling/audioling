import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';
import { createWithEqualityFn as create } from 'zustand/traditional';

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
    setLayout: (layout: Partial<NavigationState['layout']>) => void;
    setSection: (section: string) => (id: string, open?: boolean) => void;
    side: {
        general: Record<string, boolean>;
        playlists: Record<string, boolean>;
    };
    toggleRightPanel: () => void;
    toggleSection: (section: string) => (id: string) => void;
}

export const useNavigationStore = create<NavigationState>()(
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
            setLayout: (layout) => {
                set((state) => {
                    state.layout = { ...state.layout, ...layout };
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
            toggleSection: (section) => (id) => {
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

export const useGeneralNavigationSections = () => {
    return useNavigationStore(useShallow((state) => state.side.general));
};

export const usePlaylistsNavigationSections = () => {
    return useNavigationStore(useShallow((state) => state.side.playlists));
};

export const useToggleGeneralSection = () => {
    return useNavigationStore(useShallow((state) => state.toggleSection('general')));
};

export const useTogglePlaylistsSection = () => {
    return useNavigationStore(useShallow((state) => state.toggleSection('playlists')));
};

export const useSetPlaylistsSection = () => {
    return useNavigationStore(useShallow((state) => state.setSection('playlists')));
};

export const useLayout = () => {
    return useNavigationStore(useShallow((state) => state.layout));
};

export const useRightPanelOpen = () => {
    return useNavigationStore(useShallow((state) => state.layout.right.open));
};

export const useToggleRightPanel = () => {
    return useNavigationStore(useShallow((state) => state.toggleRightPanel));
};

export const useSetLayout = () => {
    return useNavigationStore(useShallow((state) => state.setLayout));
};
