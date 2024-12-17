import { useEffect, useRef } from 'react';
import { ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { createCallable } from 'react-call';
import { useParams } from 'react-router';
import { prefetchTracksByAlbumId } from '@/api/fetchers/albums.ts';
import type { GetApiLibraryIdAlbumsIdTracksParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';

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
                        sortBy: TrackListSortOptions.ID,
                        sortOrder: ListSortOrder.ASC,
                        ...(command.tracksByAlbumId.params ?? {}),
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

export type PrefetchCommand = PrefetchTracksByAlbumId | PrefetchTrackById;
