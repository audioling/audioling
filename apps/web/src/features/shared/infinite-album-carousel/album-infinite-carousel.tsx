import { memo, useCallback, useMemo } from 'react';
import type { AlbumListSortOptions } from '@repo/shared-types';
import { type ListSortOrder } from '@repo/shared-types';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { generatePath, useParams } from 'react-router';
import { apiInstance } from '@/api/api-instance.ts';
import type {
    GetApiLibraryIdAlbums200,
    GetApiLibraryIdAlbumsParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { AlbumCard } from '@/features/albums/components/album-card.tsx';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { GridCarousel } from '@/features/ui/grid-carousel/grid-carousel.tsx';
import { APP_ROUTE } from '@/routes/app-routes.ts';

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
    const baseUrl = useAuthBaseUrl();

    const cards = useMemo(
        () =>
            albums.pages.flatMap((page) =>
                page.data.map((album) => ({
                    content: (
                        <MemoizedAlbumCard
                            componentState="loaded"
                            id={album.id}
                            image={`${baseUrl}${album.imageUrl}&size=400`}
                            libraryId={libraryId}
                            metadata={[
                                {
                                    path: generatePath(APP_ROUTE.DASHBOARD_ARTISTS_DETAIL, {
                                        artistId: album.artists[0]?.id,
                                        libraryId,
                                    }),
                                    text: album.artists[0]?.name,
                                },
                            ]}
                            metadataLines={1}
                            titledata={{
                                path: generatePath(APP_ROUTE.DASHBOARD_ALBUMS_DETAIL, {
                                    albumId: album.id,
                                    libraryId,
                                }),
                                text: album.name,
                            }}
                        />
                    ),
                    id: album.id,
                })),
            ),
        [albums.pages, baseUrl, libraryId],
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
