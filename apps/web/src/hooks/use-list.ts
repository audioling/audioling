import { useCallback, useEffect } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router';
import { usePostApiLibraryIdAlbumArtistsCountInvalidate } from '@/api/openapi-generated/album-artists/album-artists.ts';
import { usePostApiLibraryIdAlbumsCountInvalidate } from '@/api/openapi-generated/albums/albums.ts';
import { usePostApiLibraryIdPlaylistsCountInvalidate } from '@/api/openapi-generated/playlists/playlists.ts';
import { usePostApiLibraryIdTracksCountInvalidate } from '@/api/openapi-generated/tracks/tracks.ts';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { randomString } from '@/utils/random-string.ts';
import { safeStringify } from '@/utils/stringify.ts';

interface UseListInitializeProps {
    setListId: (key: string, listId: string) => void;
}

export function useListInitialize({ setListId }: UseListInitializeProps) {
    const location = useLocation();
    const id = randomString(12);

    useEffect(() => {
        setListId(location.pathname, id);
    }, [id, location.pathname, setListId]);

    return id;
}

export function useListKey(args: Record<string, unknown>) {
    const location = useLocation();

    const key = safeStringify({
        ...args,
        location: location.pathname,
    });

    return key;
}

interface UseRefreshListProps {
    itemType: LibraryItemType;
    libraryId: string;
    queryKey: string[];
    setListId: (pathname: string, listId: string) => void;
}

export function useRefreshList({ queryKey, setListId, libraryId, itemType }: UseRefreshListProps) {
    const location = useLocation();
    const queryClient = useQueryClient();

    const invalidateAlbumCount = usePostApiLibraryIdAlbumsCountInvalidate();
    const invalidateTrackCount = usePostApiLibraryIdTracksCountInvalidate();
    const invalidateAlbumArtistCount = usePostApiLibraryIdAlbumArtistsCountInvalidate();
    const invalidatePlaylistCount = usePostApiLibraryIdPlaylistsCountInvalidate();

    const handleRefresh = async () => {
        switch (itemType) {
            case LibraryItemType.ALBUM:
                await invalidateAlbumCount.mutateAsync({ libraryId });
                break;
            case LibraryItemType.TRACK:
                await invalidateTrackCount.mutateAsync({ libraryId });
                break;
            case LibraryItemType.ARTIST:
                await invalidateAlbumArtistCount.mutateAsync({ libraryId });
                break;
            case LibraryItemType.ALBUM_ARTIST:
                await invalidateAlbumArtistCount.mutateAsync({ libraryId });
                break;
            case LibraryItemType.PLAYLIST:
                await invalidatePlaylistCount.mutateAsync({ libraryId });
                break;
        }

        await queryClient.invalidateQueries({ queryKey });
        setListId(location.pathname, randomString(12));
    };

    return handleRefresh;
}

interface UseListPaginationProps {
    pagination: ItemListPaginationState;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function useListPagination({ pagination, setPagination }: UseListPaginationProps) {
    const onFirstPage = useCallback(
        () => setPagination({ ...pagination, currentPage: 0 }),
        [pagination, setPagination],
    );

    const onLastPage = useCallback(
        () => setPagination({ ...pagination, currentPage: 0 }),
        [pagination, setPagination],
    );

    const onNextPage = useCallback(
        () => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 }),
        [pagination, setPagination],
    );

    const onPageChange = useCallback(
        (page: number) => setPagination({ ...pagination, currentPage: page }),
        [pagination, setPagination],
    );

    const onPreviousPage = useCallback(
        () => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 }),
        [pagination, setPagination],
    );

    return { onFirstPage, onLastPage, onNextPage, onPageChange, onPreviousPage };
}
