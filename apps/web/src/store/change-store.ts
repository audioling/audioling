import type { LibraryItemType } from '@repo/shared-types';
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createSelectors } from '@/lib/zustand.ts';

type ChangeState = {
    favorite: string[];
    rating: {
        id: string;
        rating: number;
    }[];
    unfavorite: string[];
};

type State = {
    [LibraryItemType.ALBUM]: ChangeState;
    [LibraryItemType.ALBUM_ARTIST]: ChangeState;
    [LibraryItemType.ARTIST]: ChangeState;
    [LibraryItemType.TRACK]: ChangeState;
};

type Actions = {
    addAlbumArtistFavorite: (ids: string[]) => void;
    addAlbumArtistRating: (values: { id: string; rating: number }[]) => void;
    addAlbumArtistUnfavorite: (ids: string[]) => void;
    addAlbumFavorite: (ids: string[]) => void;
    addAlbumRating: (values: { id: string; rating: number }[]) => void;
    addAlbumUnfavorite: (ids: string[]) => void;
    addArtistFavorite: (ids: string[]) => void;
    addArtistRating: (values: { id: string; rating: number }[]) => void;
    addArtistUnfavorite: (ids: string[]) => void;
    addTrackFavorite: (ids: string[]) => void;
    addTrackRating: (values: { id: string; rating: number }[]) => void;
    addTrackUnfavorite: (ids: string[]) => void;
};

type ChangeStore = State & Actions;

export const useChangeStoreBase = create<ChangeStore>()(
    persist(
        subscribeWithSelector(
            immer((set) => ({
                addAlbumArtistFavorite: (ids) => {
                    set((state) => {
                        state.albumArtist.favorite.push(...ids);
                    });
                },
                addAlbumArtistRating: (values) => {
                    set((state) => {
                        state.albumArtist.rating.push(...values);
                    });
                },
                addAlbumArtistUnfavorite: (ids) => {
                    set((state) => {
                        state.albumArtist.unfavorite.push(...ids);
                    });
                },
                addAlbumFavorite: (ids) => {
                    set((state) => {
                        state.album.favorite.push(...ids);
                    });
                },
                addAlbumRating: (values) => {
                    set((state) => {
                        state.album.rating.push(...values);
                    });
                },
                addAlbumUnfavorite: (ids) => {
                    set((state) => {
                        state.album.unfavorite.push(...ids);
                    });
                },
                addArtistFavorite: (ids) => {
                    set((state) => {
                        state.artist.favorite.push(...ids);
                    });
                },
                addArtistRating: (values) => {
                    set((state) => {
                        state.artist.rating.push(...values);
                    });
                },
                addArtistUnfavorite: (ids) => {
                    set((state) => {
                        state.artist.unfavorite.push(...ids);
                    });
                },
                addTrackFavorite: (ids) => {
                    set((state) => {
                        state.track.favorite.push(...ids);
                    });
                },
                addTrackRating: (values) => {
                    set((state) => {
                        state.track.rating.push(...values);
                    });
                },
                addTrackUnfavorite: (ids) => {
                    set((state) => {
                        state.track.unfavorite.push(...ids);
                    });
                },
                album: {
                    favorite: [],
                    rating: [],
                    unfavorite: [],
                },
                albumArtist: {
                    favorite: [],
                    rating: [],
                    unfavorite: [],
                },
                artist: {
                    favorite: [],
                    rating: [],
                    unfavorite: [],
                },
                track: {
                    favorite: [],
                    rating: [],
                    unfavorite: [],
                },
            })),
        ),
        { name: 'change-store', version: 1 },
    ),
);

export const subscribeTrackFavoritesAdded = () => {
    useChangeStoreBase.subscribe(
        (state) => state.track.favorite,
        (favorite, previousFavorite) => {
            return favorite.filter((id) => !previousFavorite.includes(id));
        },
    );
};

export const subscribeTrackFavoritesRemoved = () => {
    useChangeStoreBase.subscribe(
        (state) => state.track.unfavorite,
        (unfavorite, previousUnfavorite) => {
            return unfavorite.filter((id) => !previousUnfavorite.includes(id));
        },
    );
};

export const subscribeAlbumFavoritesAdded = () => {
    useChangeStoreBase.subscribe(
        (state) => state.album.favorite,
        (favorite, previousFavorite) => {
            return favorite.filter((id) => !previousFavorite.includes(id));
        },
    );
};

export const subscribeAlbumFavoritesRemoved = () => {
    useChangeStoreBase.subscribe(
        (state) => state.album.unfavorite,
        (unfavorite, previousUnfavorite) => {
            return unfavorite.filter((id) => !previousUnfavorite.includes(id));
        },
    );
};

export const subscribeAlbumArtistFavoritesAdded = () => {
    useChangeStoreBase.subscribe(
        (state) => state.albumArtist.favorite,
        (favorite, previousFavorite) => {
            return favorite.filter((id) => !previousFavorite.includes(id));
        },
    );
};

export const subscribeAlbumArtistFavoritesRemoved = () => {
    useChangeStoreBase.subscribe(
        (state) => state.albumArtist.unfavorite,
        (unfavorite, previousUnfavorite) => {
            return unfavorite.filter((id) => !previousUnfavorite.includes(id));
        },
    );
};

export const subscribeArtistFavoritesAdded = () => {
    useChangeStoreBase.subscribe(
        (state) => state.artist.favorite,
        (favorite, previousFavorite) => {
            return favorite.filter((id) => !previousFavorite.includes(id));
        },
    );
};

export const subscribeArtistFavoritesRemoved = () => {
    useChangeStoreBase.subscribe(
        (state) => state.artist.unfavorite,
        (unfavorite, previousUnfavorite) => {
            return unfavorite.filter((id) => !previousUnfavorite.includes(id));
        },
    );
};

export const useChangeStore = createSelectors(useChangeStoreBase);
