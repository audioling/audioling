import { useParams } from 'react-router-dom';
import { ItemCountDisplay } from '@/features/dashboard/home/item-count-display.tsx';
import { MostPlayedAlbumCarousel } from '@/features/dashboard/home/most-played-album-carousel.tsx';
import { RecentlyPlayedAlbumCarousel } from '@/features/dashboard/home/recently-played-album-carousel.tsx';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';

export function HomeRoute() {
    const { libraryId } = useParams() as { libraryId: string };

    return (
        <AnimatedContainer id="home-route">
            <Stack>
                <ItemCountDisplay libraryId={libraryId} />
                <RecentlyPlayedAlbumCarousel />
                <MostPlayedAlbumCarousel />
            </Stack>
        </AnimatedContainer>
    );
}
