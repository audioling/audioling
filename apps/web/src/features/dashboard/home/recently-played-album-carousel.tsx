import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { AlbumInfiniteCarousel } from '@/features/shared/infinite-album-carousel/album-infinite-carousel.tsx';

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
