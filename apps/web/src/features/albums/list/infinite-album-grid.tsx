import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { AlbumItem } from '@/api/api-types.ts';
import {
    getApiLibraryIdAlbums,
    getGetApiLibraryIdAlbumsQueryKey,
} from '@/api/openapi-generated/albums/albums.ts';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { AlbumCard } from '@/features/ui/card/album-card.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { InfiniteGridItemProps } from '@/features/ui/item-list/item-grid.tsx';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid.tsx';

const PAGE_SIZE = 500;

type AlbumGridItemContext = {
    baseUrl: string;
    libraryId: string;
};

function AlbumGridItem(props: InfiniteGridItemProps<AlbumItem, AlbumGridItemContext>) {
    const { context, data, index } = props;

    if (data) {
        return (
            <AlbumCard
                componentState="loaded"
                id={data.id}
                image={`${context?.baseUrl}${data.imageUrl}&size=300`}
                metadata={[{ path: '/', text: data.artists[0]?.name }]}
                metadataLines={1}
                thumbHash={data.thumbHash ?? undefined}
                titledata={{ path: '/', text: data.name }}
            />
        );
    }

    return (
        <AlbumCard
            componentState="loading"
            id={index.toString()}
            image=""
            metadata={[]}
            metadataLines={1}
            titledata={{ path: '/', text: '' }}
        />
    );
}

const MemoizedAlbumGridItem = memo(AlbumGridItem);

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

                    const { data } = await queryClient.fetchQuery({
                        queryFn: () =>
                            getApiLibraryIdAlbums(libraryId, {
                                ...params,
                                limit: PAGE_SIZE.toString(),
                                offset: (page * PAGE_SIZE).toString(),
                            }),
                        queryKey: getGetApiLibraryIdAlbumsQueryKey(libraryId, params),
                        staleTime: 60 * 1000,
                    });

                    setData((prevData) => {
                        const newData = [...prevData];
                        data.forEach((item, index) => {
                            newData[page * PAGE_SIZE + index] = item;
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
