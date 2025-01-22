import { Suspense } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useParams } from 'react-router';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { TrackListContent } from '@/features/tracks/list/track-list-content.tsx';
import { TrackListHeader } from '@/features/tracks/list/track-list-header.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';
import { useRefreshList } from '@/hooks/use-list.ts';

export function TrackListRoute() {
    const { libraryId } = useParams() as { libraryId: string };

    const { show } = useDelayedRender(300);

    const { handleRefresh, listId } = useRefreshList({
        itemType: LibraryItemType.TRACK,
        libraryId,
        queryKey: [[`/api/${libraryId}/tracks`]],
    });

    return (
        <PageContainer id="track-list-route">
            <TrackListHeader handleRefresh={handleRefresh} />
            {show && (
                <AnimatedContainer>
                    <Suspense fallback={<FullPageSpinner />}>
                        <ComponentErrorBoundary>
                            <TrackListContent key={listId} />
                        </ComponentErrorBoundary>
                    </Suspense>
                </AnimatedContainer>
            )}
        </PageContainer>
    );
}
