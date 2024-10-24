import { useMemo } from 'react';
import type { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { apiInstance } from '@/api/api-instance.ts';
import type {
    GetApiLibraryIdAlbums200,
    GetApiLibraryIdAlbumsParams,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { AlbumCard } from '@/features/ui/card/album-card.tsx';
import { GridCarousel } from '@/features/ui/grid-carousel/grid-carousel.tsx';

interface AlbumCarouselProps {
    rowCount?: number;
    sortBy: AlbumListSortOptions;
    sortOrder: ListSortOrder;
    title: string;
}

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
                        <AlbumCard
                            alt={album.name}
                            descriptions={[album.name, album.artists[0]?.name]}
                            image={`${baseUrl}${album.imageUrl}&size=200`}
                        />
                    ),
                    id: album.id,
                })),
            ),
        [albums.pages, baseUrl],
    );

    return (
        <GridCarousel
            cards={cards}
            loadNextPage={fetchNextPage}
            rowCount={rowCount}
            title={title}
            onNextPage={() => {}}
            onPrevPage={() => {}}
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
        queryKey: [libraryId, 'albums', sortBy, sortOrder],
    });

    return query;
}
