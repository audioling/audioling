import { Suspense } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useParams } from 'react-router';
import { AlbumArtistListContent } from '@/features/artists/list/album-artist-list-content.tsx';
import { AlbumArtistListHeader } from '@/features/artists/list/album-artist-list-header.tsx';
import { AnimatedContainer } from '@/features/shared/animated-container/animated-container.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { PageContainer } from '@/features/shared/page-container/page-container.tsx';
import { useDelayedRender } from '@/hooks/use-delayed-render.ts';
import { useRefreshList } from '@/hooks/use-list.ts';

export function AlbumArtistListRoute() {
    const { libraryId } = useParams() as { libraryId: string };
    const { show } = useDelayedRender(300);

    const { handleRefresh } = useRefreshList({
        itemType: LibraryItemType.ALBUM_ARTIST,
        libraryId,
        queryKey: [`/api/${libraryId}/album-artists`],
    });

    return (
        <PageContainer id="album-artist-list-route">
            <AlbumArtistListHeader handleRefresh={handleRefresh} />
            {show && (
                <AnimatedContainer>
                    <Suspense fallback={<FullPageSpinner />}>
                        <ComponentErrorBoundary>
                            <AlbumArtistListContent />
                        </ComponentErrorBoundary>
                    </Suspense>
                </AnimatedContainer>
            )}
        </PageContainer>
    );
}
