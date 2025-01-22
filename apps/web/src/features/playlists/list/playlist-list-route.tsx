import { Suspense } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useParams } from 'react-router';
import { PlaylistListContent } from '@/features/playlists/list/playlist-list-content.tsx';
import { PlaylistListHeader } from '@/features/playlists/list/playlist-list-header.tsx';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { EmptyPlaceholder } from '@/features/ui/placeholders/empty-placeholder.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';
import { useRefreshList } from '@/hooks/use-list.ts';

export function PlaylistListRoute() {
    const { libraryId } = useParams() as { libraryId: string };

    const { show } = useDelayedRender(300);

    const { handleRefresh, listId } = useRefreshList({
        itemType: LibraryItemType.PLAYLIST,
        libraryId,
        queryKey: [[`/api/${libraryId}/playlists`]],
    });

    return (
        <PageContainer id="playlist-list-route">
            <PlaylistListHeader handleRefresh={handleRefresh} />
            {show && (
                <AnimatedContainer>
                    <Suspense fallback={<EmptyPlaceholder />}>
                        <ComponentErrorBoundary>
                            <PlaylistListContent key={listId} />
                        </ComponentErrorBoundary>
                    </Suspense>
                </AnimatedContainer>
            )}
        </PageContainer>
    );
}
