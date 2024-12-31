import { Suspense } from 'react';
import { AlbumListContent } from '@/features/albums/list/album-list-content.tsx';
import { AlbumListHeader } from '@/features/albums/list/album-list-header.tsx';
import { useAlbumListStore } from '@/features/albums/stores/album-list-store.ts';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';
import { useListInitialize } from '@/hooks/use-list.ts';

export function AlbumListRoute() {
    const setListId = useAlbumListStore.use.setListId();
    useListInitialize({ setListId });

    const { show } = useDelayedRender(300);

    return (
        <PageContainer id="album-list-route">
            <AlbumListHeader />
            {show && (
                <AnimatedContainer>
                    <Suspense fallback={<FullPageSpinner />}>
                        <ComponentErrorBoundary>
                            <AlbumListContent />
                        </ComponentErrorBoundary>
                    </Suspense>
                </AnimatedContainer>
            )}
        </PageContainer>
    );
}
