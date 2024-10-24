import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { AlbumInfiniteCarousel } from '@/features/shared/components/album-infinite-carousel.tsx';

export function MostPlayedAlbumCarousel() {
    return (
        <AlbumInfiniteCarousel
            rowCount={1}
            sortBy={AlbumListSortOptions.PLAY_COUNT}
            sortOrder={ListSortOrder.DESC}
            title="Most played"
        />
    );
}
