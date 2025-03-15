import { ListSortOrder, TrackListSortOptions } from '@repo/shared-types/app-types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { createCallable } from 'react-call';
import { useParams } from 'react-router';

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

interface PrefetchTracksByAlbumId {
    tracksByAlbumId: {
        id: string[];
        params?: GetApiLibraryIdAlbumsIdTracksParams;
    };
}

interface PrefetchTrackById {
    trackById: {
        id: string;
    };
}

interface PrefetchTracksByPlaylistId {
    tracksByPlaylistId: {
        id: string[];
        params?: GetApiLibraryIdPlaylistsIdTracksParams;
    };
}

interface PrefetchTracksByGenreId {
    tracksByGenreId: {
        id: string[];
        params?: GetApiLibraryIdGenresIdTracksParams;
    };
}

interface PrefetchTracksByAlbumArtistId {
    tracksByAlbumArtistId: {
        id: string[];
        params?: GetApiLibraryIdAlbumArtistsIdTracksParams;
    };
}

export type PrefetchCommand =
    | PrefetchTracksByAlbumId
    | PrefetchTracksByAlbumArtistId
    | PrefetchTracksByPlaylistId
    | PrefetchTrackById
    | PrefetchTracksByGenreId;
