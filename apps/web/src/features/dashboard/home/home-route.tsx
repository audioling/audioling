import { useParams } from 'react-router-dom';
import { MostPlayedAlbumCarousel } from '@/features/dashboard/home/most-played-album-carousel.tsx';
import { NewlyAddedAlbumCarousel } from '@/features/dashboard/home/newly-added-album-carousel.tsx';
import { RecentlyPlayedAlbumCarousel } from '@/features/dashboard/home/recently-played-album-carousel.tsx';
import { ItemCountDisplay } from '@/features/dashboard/item-count/item-count-display.tsx';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export function HomeRoute() {
    const { libraryId } = useParams() as { libraryId: string };

    return (
        <AnimatedContainer id="home-route">
            <Stack>
                <ItemCountDisplay libraryId={libraryId} />
                <RecentlyPlayedAlbumCarousel />
                <NewlyAddedAlbumCarousel />
                <MostPlayedAlbumCarousel />
            </Stack>
        </AnimatedContainer>
    );
}
