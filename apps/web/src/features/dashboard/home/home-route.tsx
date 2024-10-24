import { ItemCountDisplay } from '@/features/dashboard/home/item-count-display.tsx';
import { MostPlayedAlbumCarousel } from '@/features/dashboard/home/most-played-album-carousel.tsx';
import { RecentlyPlayedAlbumCarousel } from '@/features/dashboard/home/recently-played-album-carousel.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export function HomeRoute() {
    return (
        <Stack id="home-route">
            <ItemCountDisplay />
            <RecentlyPlayedAlbumCarousel />
            <MostPlayedAlbumCarousel />
        </Stack>
    );
}
