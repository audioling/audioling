import { memo, useCallback, useMemo } from 'react';
import type { AlbumListSortOptions } from '@repo/shared-types';
import { LibraryItemType, type ListSortOrder } from '@repo/shared-types';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useParams } from 'react-router';
import { apiInstance } from '@/api/api-instance.ts';
import type {
    GetApiLibraryIdAlbums200,
    GetApiLibraryIdAlbumsParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { AlbumCard } from '@/features/albums/components/album-card.tsx';
import { GridCarousel } from '@/features/ui/grid-carousel/grid-carousel.tsx';

interface AlbumCarouselProps {
    rowCount?: number;
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
    title: string;
}

const MemoizedAlbumCard = memo(AlbumCard);

export function AlbumInfiniteCarousel(props: AlbumCarouselProps) {
    const { rowCount = 1, sortBy, sortOrder, title } = props;
    const { libraryId } = useParams() as { libraryId: string };
    const { data: albums, fetchNextPage } = useAlbumListInfinite(libraryId, sortBy, sortOrder, 20);

    const cards = useMemo(
        () =>
            albums.pages.flatMap((page) => {
                const loadedCards = page.data.map((album) => ({
                    content: (
                        <MemoizedAlbumCard
                            album={album}
                            componentState="loaded"
                            id={album.id}
                            itemType={LibraryItemType.ALBUM}
                            libraryId={libraryId}
                            metadataLines={1}
                        />
                    ),
                    id: album.id,
                }));

                if (page.data.length === 20) {
                    return loadedCards;
                }

                return [
                    ...loadedCards,
                    ...Array.from({ length: 20 - page.data.length }).map(() => {
                        const id = nanoid();
                        return {
                            content: (
                                <MemoizedAlbumCard componentState={'loading'} metadataLines={1} />
                            ),
                            id,
                        };
                    }),
                ];
            }),
        [albums.pages, libraryId],
    );

    const handleNextPage = useCallback(() => {}, []);

    const handlePrevPage = useCallback(() => {}, []);

    return (
        <GridCarousel
            cards={cards}
            loadNextPage={fetchNextPage}
            rowCount={rowCount}
            title={title}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
        />
    );
}

function useAlbumListInfinite(
    libraryId: string,
    sortBy: AlbumListSortOptions,
    sortOrder: ListSortOrder,
    itemLimit: number,
) {
    const query = useSuspenseInfiniteQuery<GetApiLibraryIdAlbums200>({
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (lastPage.data.length < itemLimit) {
                return undefined;
            }

            const nextPageParam = Number(lastPageParam) + itemLimit;

            return String(nextPageParam);
        },
        initialPageParam: '0',
        queryFn: ({ pageParam }) => {
            const params: GetApiLibraryIdAlbumsParams = {
                limit: String(itemLimit),
                offset: pageParam as string,
                sortBy,
                sortOrder,
            };

            return apiInstance<GetApiLibraryIdAlbums200>({
                method: 'GET',
                params,
                url: `/api/${libraryId}/albums`,
            });
        },
        queryKey: [`/api/${libraryId}/albums`, 'infinite', { sortBy, sortOrder }],
    });

    return query;
}
