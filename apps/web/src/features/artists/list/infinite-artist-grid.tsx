import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { ArtistItem } from '@/api/api-types.ts';
import {
    getApiLibraryIdAlbumArtists,
    getGetApiLibraryIdAlbumArtistsQueryKey,
} from '@/api/openapi-generated/album-artists/album-artists.ts';
import type { GetApiLibraryIdAlbumArtistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    type ArtistGridItemContext,
    MemoizedArtistGridItem,
} from '@/features/artists/list/artist-grid-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';

interface InfiniteArtistGridProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdAlbumArtistsParams;
}

export function InfiniteArtistGrid(props: InfiniteArtistGridProps) {
    const { listKey } = props;

    return (
        <ListWrapper listKey={listKey}>
            <InfiniteArtistGridContent {...props} />
        </ListWrapper>
    );
}

export function InfiniteArtistGridContent({
    baseUrl,
    itemCount,
    libraryId,
    pagination,
    params,
}: InfiniteArtistGridProps) {
    const queryClient = useQueryClient();
    const [data, setData] = useState<(ArtistItem | undefined)[]>(
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
                        queryFn: () => getApiLibraryIdAlbumArtists(libraryId, paramsWithPagination),
                        queryKey: getGetApiLibraryIdAlbumArtistsQueryKey(
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
        <InfiniteItemGrid<ArtistItem, ArtistGridItemContext>
            GridComponent={MemoizedArtistGridItem}
            context={{ baseUrl, libraryId }}
            data={data}
            enableExpanded={false}
            itemCount={itemCount}
            onRangeChanged={handleRangeChanged}
        />
    );
}
