import { useEffect, useRef } from 'react';
import { ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { createCallable } from 'react-call';
import { useParams } from 'react-router';
import { prefetchTracksByAlbumId } from '@/api/fetchers/albums.ts';
import { prefetchTracksByAlbumArtistId } from '@/api/fetchers/artists.ts';
import { prefetchTracksByGenreId } from '@/api/fetchers/genres.ts';
import { prefetchTracksByPlaylistId } from '@/api/fetchers/playlists.ts';
import type {
    GetApiLibraryIdAlbumArtistsIdTracksParams,
    GetApiLibraryIdAlbumsIdTracksParams,
    GetApiLibraryIdGenresIdTracksParams,
    GetApiLibraryIdPlaylistsIdTracksParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';

interface PrefetchControllerProps {
    cmd: PrefetchCommand;
}

export const PrefetchController = createCallable<PrefetchControllerProps, void>(({ call, cmd }) => {
    const { libraryId } = useParams() as { libraryId: string };
    const queryClient = useQueryClient();

    const isExecuted = useRef<boolean>(false);

    useEffect(() => {
        if (isExecuted.current) {
            return;
        }
        isExecuted.current = true;

        const action = Object.keys(cmd)[0] as keyof PrefetchCommand;

        switch (action) {
            case 'tracksByAlbumId': {
                const command = cmd as PrefetchTracksByAlbumId;
                for (const id of command.tracksByAlbumId.id) {
                    prefetchTracksByAlbumId(queryClient, libraryId, id, {
                        limit: '-1',
                        offset: '0',
                        sortBy: TrackListSortOptions.ID,
                        sortOrder: ListSortOrder.ASC,
                        ...(command.tracksByAlbumId.params ?? {}),
                    });
                }
                break;
            }
            case 'tracksByAlbumArtistId': {
                const command = cmd as PrefetchTracksByAlbumArtistId;
                for (const id of command.tracksByAlbumArtistId.id) {
                    prefetchTracksByAlbumArtistId(queryClient, libraryId, id, {
                        limit: '-1',
                        offset: '0',
                        sortBy: TrackListSortOptions.ID,
                        sortOrder: ListSortOrder.ASC,
                        ...(command.tracksByAlbumArtistId.params ?? {}),
                    });
                }
                break;
            }
            case 'tracksByPlaylistId': {
                const command = cmd as PrefetchTracksByPlaylistId;
                for (const id of command.tracksByPlaylistId.id) {
                    prefetchTracksByPlaylistId(queryClient, libraryId, id, {
                        limit: '-1',
                        offset: '0',
                        sortBy: TrackListSortOptions.ID,
                        sortOrder: ListSortOrder.ASC,
                        ...(command.tracksByPlaylistId.params ?? {}),
                    });
                }
                break;
            }
            case 'tracksByGenreId': {
                const command = cmd as PrefetchTracksByGenreId;
                for (const id of command.tracksByGenreId.id) {
                    prefetchTracksByGenreId(queryClient, libraryId, id, {
                        limit: '-1',
                        offset: '0',
                        sortBy: TrackListSortOptions.ID,
                        sortOrder: ListSortOrder.ASC,
                        ...(command.tracksByGenreId.params ?? {}),
                    });
                }
                break;
            }
        }

        call.end();
    }, [call, cmd, libraryId, queryClient]);

    return null;
});

type PrefetchTracksByAlbumId = {
    tracksByAlbumId: {
        id: string[];
        params?: GetApiLibraryIdAlbumsIdTracksParams;
    };
};

type PrefetchTrackById = {
    trackById: {
        id: string;
    };
};

type PrefetchTracksByPlaylistId = {
    tracksByPlaylistId: {
        id: string[];
        params?: GetApiLibraryIdPlaylistsIdTracksParams;
    };
};

type PrefetchTracksByGenreId = {
    tracksByGenreId: {
        id: string[];
        params?: GetApiLibraryIdGenresIdTracksParams;
    };
};

type PrefetchTracksByAlbumArtistId = {
    tracksByAlbumArtistId: {
        id: string[];
        params?: GetApiLibraryIdAlbumArtistsIdTracksParams;
    };
};

export type PrefetchCommand =
    | PrefetchTracksByAlbumId
    | PrefetchTracksByAlbumArtistId
    | PrefetchTracksByPlaylistId
    | PrefetchTrackById
    | PrefetchTracksByGenreId;
