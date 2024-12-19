import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { PlaylistItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdPlaylistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    getApiLibraryIdPlaylists,
    getGetApiLibraryIdPlaylistsQueryKey,
} from '@/api/openapi-generated/playlists/playlists.ts';
import {
    MemoizedPlaylistGridItem,
    type PlaylistGridItemContext,
} from '@/features/playlists/list/playlist-grid-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';

interface InfinitePlaylistGridProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdPlaylistsParams;
}

export function InfinitePlaylistGrid(props: InfinitePlaylistGridProps) {
    const { listKey } = props;

    return (
        <ListWrapper listKey={listKey}>
            <InfinitePlaylistGridContent {...props} />
        </ListWrapper>
    );
}

export function InfinitePlaylistGridContent({
    baseUrl,
    itemCount,
    libraryId,
    pagination,
    params,
}: InfinitePlaylistGridProps) {
    const queryClient = useQueryClient();
    const [data, setData] = useState<(PlaylistItem | undefined)[]>(
        itemListHelpers.getInitialData(itemCount),
    );

    const loadedPages = useRef<Record<number, boolean>>({});

    useEffect(() => {
        loadedPages.current = itemListHelpers.getPageMap(itemCount, pagination.itemsPerPage);
    }, [itemCount, pagination.itemsPerPage]);

    const handleRangeChanged = useCallback(
        async (event: { endIndex: number; startIndex: number }) => {
            const { startIndex, endIndex } = event;
            const pagesToLoad = itemListHelpers.getPagesToLoad(
                startIndex,
                endIndex,
                pagination.itemsPerPage,
                loadedPages.current,
            );

            if (pagesToLoad.length > 0) {
                for (const page of pagesToLoad) {
                    loadedPages.current[page] = true;

                    const currentOffset = page * pagination.itemsPerPage;

                    const paramsWithPagination = {
                        ...params,
                        limit: pagination.itemsPerPage.toString(),
                        offset: currentOffset.toString(),
                    };

                    const { data } = await queryClient.fetchQuery({
                        queryFn: () => getApiLibraryIdPlaylists(libraryId, paramsWithPagination),
                        queryKey: getGetApiLibraryIdPlaylistsQueryKey(
                            libraryId,
                            paramsWithPagination,
                        ),
                        staleTime: 30 * 1000,
                    });

                    setData((prevData) => {
                        const newData = [...prevData];
                        const startIndex = currentOffset;
                        data.forEach((item, index) => {
                            newData[startIndex + index] = item;
                        });
                        return newData;
                    });
                }
            }
        },
        [libraryId, pagination.itemsPerPage, params, queryClient],
    );

    return (
        <InfiniteItemGrid<PlaylistItem, PlaylistGridItemContext>
            GridComponent={MemoizedPlaylistGridItem}
            context={{ baseUrl, libraryId }}
            data={data}
            itemCount={itemCount}
            onRangeChanged={handleRangeChanged}
        />
    );
}
