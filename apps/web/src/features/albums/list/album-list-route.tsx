import { Suspense } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useParams } from 'react-router';
import { AlbumListContent } from '@/features/albums/list/album-list-content.tsx';
import { AlbumListHeader } from '@/features/albums/list/album-list-header.tsx';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';
import { useRefreshList } from '@/hooks/use-list.ts';

export function AlbumListRoute() {
    const { libraryId } = useParams() as { libraryId: string };

    const { show } = useDelayedRender(300);

    const { handleRefresh, listId } = useRefreshList({
        itemType: LibraryItemType.ALBUM,
        libraryId,
        queryKey: [[`/api/${libraryId}/albums`]],
    });

    return (
        <PageContainer id="album-list-route">
            <AlbumListHeader handleRefresh={handleRefresh} />
            {show && (
                <AnimatedContainer>
                    <Suspense fallback={<FullPageSpinner />}>
                        <ComponentErrorBoundary>
                            <AlbumListContent key={listId} />
                        </ComponentErrorBoundary>
                    </Suspense>
                </AnimatedContainer>
            )}
        </PageContainer>
    );
}
