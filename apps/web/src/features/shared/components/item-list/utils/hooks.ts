import type { ItemListPaginationState } from '/@/features/shared/components/item-list/types';
import type { AuthServer, ServerItemType } from '@repo/shared-types/app-types';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router';
import { randomString } from '/@/utils/random-string';
import { safeStringify } from '/@/utils/stringify';

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

// interface UseRefreshListProps {
//     itemType: ServerItemType;
//     libraryId: string;
//     queryKey: QueryKey;
// }

// export function useRefreshList({ itemType, libraryId, queryKey }: UseRefreshListProps) {
//     const location = useLocation();
//     const queryClient = useQueryClient();

//     const [listId, setListId] = useState<string>(
//         itemListHelpers.generateListId(libraryId, location.pathname),
//     );

//     const invalidateAlbumCount = () => { };
//     const invalidateTrackCount = () => { };
//     const invalidateAlbumArtistCount = () => { };
//     const invalidatePlaylistCount = () => { };

//     const handleRefresh = async () => {
//         switch (itemType) {
//             case ServerItemType.ALBUM:
//                 await invalidateAlbumCount.mutateAsync({ libraryId });
//                 break;
//             case ServerItemType.TRACK:
//                 await invalidateTrackCount.mutateAsync({ libraryId });
//                 break;
//             case ServerItemType.ARTIST:
//                 await invalidateAlbumArtistCount.mutateAsync({ libraryId });
//                 break;
//             case ServerItemType.ALBUM_ARTIST:
//                 await invalidateAlbumArtistCount.mutateAsync({ libraryId });
//                 break;
//             case ServerItemType.PLAYLIST:
//                 await invalidatePlaylistCount.mutateAsync({ libraryId });
//                 break;
//         }

//         // Invalidate the list fetch query
//         await queryClient.invalidateQueries({ queryKey });

//         queryClient.removeQueries({
//             exact: false,
//             queryKey: [libraryId, 'list', itemType],
//         });

//         setListId(itemListHelpers.generateListId(libraryId, location.pathname));
//     };

//     return { handleRefresh, listId };
// }

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

export type ListQueryData = Record<string, string>;

export type ItemQueryData = Record<string, unknown>;

export function listDataQueryKey(server: AuthServer, type: ServerItemType, key?: string, params?: Record<string, any>) {
    if (!key) {
        return [server.id, type, 'list-data'];
    }

    if (!params) {
        return [server.id, type, 'list-data', key];
    }

    return [server.id, type, 'list-data', key, params];
}
