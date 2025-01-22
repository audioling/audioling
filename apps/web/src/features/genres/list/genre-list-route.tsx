import { Suspense } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useParams } from 'react-router';
import { GenreListContent } from '@/features/genres/list/genre-list-content.tsx';
import { GenreListHeader } from '@/features/genres/list/genre-list-header.tsx';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';
import { useRefreshList } from '@/hooks/use-list.ts';

export function GenreListRoute() {
    const { libraryId } = useParams() as { libraryId: string };

    const { show } = useDelayedRender(300);

    const { handleRefresh } = useRefreshList({
        itemType: LibraryItemType.GENRE,
        libraryId,
        queryKey: [`/api/${libraryId}/genres`],
    });

    return (
        <PageContainer id="genre-list-route">
            <GenreListHeader handleRefresh={handleRefresh} />
            {show && (
                <AnimatedContainer>
                    <Suspense fallback={<FullPageSpinner />}>
                        <ComponentErrorBoundary>
                            <GenreListContent />
                        </ComponentErrorBoundary>
                    </Suspense>
                </AnimatedContainer>
            )}
        </PageContainer>
    );
}
