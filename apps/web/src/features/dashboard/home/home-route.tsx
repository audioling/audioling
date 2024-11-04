import { ItemCountDisplay } from '@/features/dashboard/home/item-count-display.tsx';
import { MostPlayedAlbumCarousel } from '@/features/dashboard/home/most-played-album-carousel.tsx';
import { RecentlyPlayedAlbumCarousel } from '@/features/dashboard/home/recently-played-album-carousel.tsx';
import { AnimatedPage } from '@/features/shared/animated-page/animated-page.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export function HomeRoute() {
    return (
        <AnimatedPage id="home-route">
            <Stack>
                <ItemCountDisplay />
                <RecentlyPlayedAlbumCarousel />
                <MostPlayedAlbumCarousel />
            </Stack>
        </AnimatedPage>
    );
}
