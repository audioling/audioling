import { Suspense } from 'react';
import { GenreListContent } from '@/features/genres/list/genre-list-content.tsx';
import { GenreListHeader } from '@/features/genres/list/genre-list-header.tsx';
import { useGenreListStore } from '@/features/genres/stores/genre-list-store.ts';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { EmptyPlaceholder } from '@/features/ui/placeholders/empty-placeholder.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';
import { useListInitialize } from '@/hooks/use-list.ts';

export function GenreListRoute() {
    const setListId = useGenreListStore.use.setListId();
    useListInitialize({ setListId });

    const { show } = useDelayedRender(300);

    return (
        <PageContainer id="album-list-route">
            <GenreListHeader />
            {show && (
                <AnimatedContainer>
                    <Suspense fallback={<EmptyPlaceholder />}>
                        <ComponentErrorBoundary>
                            <GenreListContent />
                        </ComponentErrorBoundary>
                    </Suspense>
                </AnimatedContainer>
            )}
        </PageContainer>
    );
}
