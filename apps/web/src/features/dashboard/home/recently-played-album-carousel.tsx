import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { AlbumInfiniteCarousel } from '@/features/shared/components/album-infinite-carousel.tsx';

export function RecentlyPlayedAlbumCarousel() {
    return (
        <AlbumInfiniteCarousel
            rowCount={2}
            sortBy={AlbumListSortOptions.DATE_PLAYED}
            sortOrder={ListSortOrder.DESC}
            title="Recently played"
        />
    );
}
