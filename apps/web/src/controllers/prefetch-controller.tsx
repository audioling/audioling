import type {
    AdapterAlbumTrackListRequest,
    AdapterArtistTrackListRequest,
    AdapterGenreTrackListRequest,
    AdapterPlaylistTrackListRequest,
} from '@repo/shared-types/adapter-types';
import { ListSortOrder, TrackListSortOptions } from '@repo/shared-types/app-types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { createCallable } from 'react-call';
import { useParams } from 'react-router';
import { prefetchAlbumTrackList } from '/@/features/albums/api/get-album-track-list';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { logger } from '/@/logger';

interface PrefetchControllerProps {
    cmd: PrefetchCommand;
}

export const PrefetchController = createCallable<PrefetchControllerProps, void>(({ call, cmd }) => {
    const { libraryId } = useParams() as { libraryId: string };
    const { server } = useAppContext();
    const queryClient = useQueryClient();

    const isExecuted = useRef<boolean>(false);

    useEffect(() => {
        if (isExecuted.current) {
            return;
        }
        isExecuted.current = true;

        const action = Object.keys(cmd)[0] as keyof PrefetchCommand;

        logger.info(`prefetch-controller: ${action}`, cmd);

        switch (action) {
            case 'tracksByAlbumId': {
                const command = cmd as PrefetchTracksByAlbumId;
                for (const id of command.tracksByAlbumId.ids) {
                    prefetchAlbumTrackList(queryClient, server, {
                        query: {
                            id,
                            limit: -1,
                            offset: 0,
                            sortBy: TrackListSortOptions.ID,
                            sortOrder: ListSortOrder.ASC,
                            ...(command.tracksByAlbumId.params ?? {}),
                        },
                    });
                }
                break;
            }
            // case 'tracksByAlbumArtistId': {
            //     const command = cmd as PrefetchTracksByAlbumArtistId;
            //     for (const id of command.tracksByAlbumArtistId.id) {
            //         prefetchTracksByAlbumArtistId(queryClient, libraryId, id, {
            //             limit: '-1',
            //             offset: '0',
            //             sortBy: TrackListSortOptions.ID,
            //             sortOrder: ListSortOrder.ASC,
            //             ...(command.tracksByAlbumArtistId.params ?? {}),
            //         });
            //     }
            //     break;
            // }
            // case 'tracksByPlaylistId': {
            //     const command = cmd as PrefetchTracksByPlaylistId;
            //     for (const id of command.tracksByPlaylistId.id) {
            //         prefetchTracksByPlaylistId(queryClient, libraryId, id, {
            //             limit: '-1',
            //             offset: '0',
            //             sortBy: TrackListSortOptions.ID,
            //             sortOrder: ListSortOrder.ASC,
            //             ...(command.tracksByPlaylistId.params ?? {}),
            //         });
            //     }
            //     break;
            // }
            // case 'tracksByGenreId': {
            //     const command = cmd as PrefetchTracksByGenreId;
            //     for (const id of command.tracksByGenreId.id) {
            //         prefetchTracksByGenreId(queryClient, libraryId, id, {
            //             limit: '-1',
            //             offset: '0',
            //             sortBy: TrackListSortOptions.ID,
            //             sortOrder: ListSortOrder.ASC,
            //             ...(command.tracksByGenreId.params ?? {}),
            //         });
            //     }
            //     break;
            // }
        }

        call.end();
    }, [call, cmd, libraryId, queryClient, server]);

    return null;
});

interface PrefetchTracksByAlbumId {
    tracksByAlbumId: {
        ids: string[];
        params?: Omit<AdapterAlbumTrackListRequest['query'], 'id' | 'limit' | 'offset'>;
    };
}

interface PrefetchTrackById {
    trackById: {
        id: string;
    };
}

interface PrefetchTracksByPlaylistId {
    tracksByPlaylistId: {
        ids: string[];
        params?: AdapterPlaylistTrackListRequest;
    };
}

interface PrefetchTracksByGenreId {
    tracksByGenreId: {
        ids: string[];
        params?: AdapterGenreTrackListRequest;
    };
}

interface PrefetchTracksByAlbumArtistId {
    tracksByAlbumArtistId: {
        ids: string[];
        params?: AdapterArtistTrackListRequest;
    };
}

export type PrefetchCommand =
    | PrefetchTracksByAlbumId
    | PrefetchTracksByAlbumArtistId
    | PrefetchTracksByPlaylistId
    | PrefetchTrackById
    | PrefetchTracksByGenreId;
