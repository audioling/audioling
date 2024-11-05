import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AlbumItem } from '@/api/api-types.ts';
import {
    getApiLibraryIdAlbums,
    getGetApiLibraryIdAlbumsQueryKey,
} from '@/api/openapi-generated/albums/albums.ts';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import type { AlbumGridItemContext } from '@/features/albums/list/album-grid-item.tsx';
import { MemoizedAlbumGridItem } from '@/features/albums/list/album-grid-item.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';

const PAGE_SIZE = 500;

interface InfiniteAlbumGridProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    params: GetApiLibraryIdAlbumsParams;
}

export function InfiniteAlbumGrid({
    baseUrl,
    itemCount,
    libraryId,
    params,
}: InfiniteAlbumGridProps) {
    const queryClient = useQueryClient();
    const [data, setData] = useState<(AlbumItem | undefined)[]>(
        itemListHelpers.getInitialData(itemCount),
    );

    const loadedPages = useRef<Record<number, boolean>>({});

    useEffect(() => {
        loadedPages.current = itemListHelpers.getPageMap(itemCount, PAGE_SIZE);
    }, [itemCount]);

    const handleRangeChanged = useCallback(
        async (event: { endIndex: number; startIndex: number }) => {
            const { startIndex, endIndex } = event;
            const pagesToLoad = itemListHelpers.getPagesToLoad(
                startIndex,
                endIndex,
                PAGE_SIZE,
                loadedPages.current,
            );

            if (pagesToLoad.length > 0) {
                for (const page of pagesToLoad) {
                    loadedPages.current[page] = true;

                    const currentOffset = page * PAGE_SIZE;

                    const paramsWithPagination = {
                        ...params,
                        limit: PAGE_SIZE.toString(),
                        offset: currentOffset.toString(),
                    };

                    const { data } = await queryClient.fetchQuery({
                        queryFn: () => getApiLibraryIdAlbums(libraryId, paramsWithPagination),
                        queryKey: getGetApiLibraryIdAlbumsQueryKey(libraryId, paramsWithPagination),
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
        [libraryId, params, queryClient],
    );

    return (
        <InfiniteItemGrid<AlbumItem, AlbumGridItemContext>
            GridComponent={MemoizedAlbumGridItem}
            context={{ baseUrl, libraryId }}
            data={data}
            itemCount={itemCount}
            onRangeChanged={handleRangeChanged}
        />
    );
}
