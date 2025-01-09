import { Suspense } from 'react';
import { ArtistListContent } from '@/features/artists/list/artist-list-content.tsx';
import { ArtistListHeader } from '@/features/artists/list/artist-list-header.tsx';
import { useArtistListStore } from '@/features/artists/stores/artist-list-store.ts';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';
import { useListInitialize } from '@/hooks/use-list.ts';

export function ArtistListRoute() {
    const setListId = useArtistListStore.use.setListId();
    useListInitialize({ setListId });

    const { show } = useDelayedRender(300);

    return (
        <PageContainer id="artist-list-route">
            <ArtistListHeader />
            {show && (
                <AnimatedContainer>
                    <Suspense fallback={<FullPageSpinner />}>
                        <ComponentErrorBoundary>
                            <ArtistListContent />
                        </ComponentErrorBoundary>
                    </Suspense>
                </AnimatedContainer>
            )}
        </PageContainer>
    );
}
