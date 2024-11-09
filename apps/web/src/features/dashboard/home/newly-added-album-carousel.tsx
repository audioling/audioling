import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { AlbumInfiniteCarousel } from '@/features/shared/infinite-album-carousel/album-infinite-carousel.tsx';

export function NewlyAddedAlbumCarousel() {
    return (
        <AlbumInfiniteCarousel
            rowCount={1}
            sortBy={AlbumListSortOptions.DATE_ADDED}
            sortOrder={ListSortOrder.ASC}
            title="Newly added"
        />
    );
}
