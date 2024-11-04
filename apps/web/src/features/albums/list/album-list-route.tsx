import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useGetApiLibraryIdAlbumsCountSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { AlbumListHeader } from '@/features/albums/list/album-list-header.tsx';
import { InfiniteAlbumGrid } from '@/features/albums/list/infinite-album-grid.tsx';
import { useAlbumListState } from '@/features/albums/stores/album-list-store.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { AnimatedPage } from '@/features/shared/animated-page/animated-page.tsx';
import { ComponentErrorBoundary } from '@/features/shared/error-boundary/component-error-boundary.tsx';

export function AlbumListRoute() {
    return (
        <AnimatedPage>
            <AlbumListHeader />
            <Suspense fallback={<div></div>}>
                <ComponentErrorBoundary>
                    <ListContent />
                </ComponentErrorBoundary>
            </Suspense>
        </AnimatedPage>
    );
}

function ListContent() {
    const { libraryId } = useParams() as { libraryId: string };
    const { sortBy, sortOrder } = useAlbumListState();
    const baseUrl = useAuthBaseUrl();

    const { data: itemCount } = useGetApiLibraryIdAlbumsCountSuspense(libraryId, {
        sortBy,
        sortOrder,
    });

    return (
        <InfiniteAlbumGrid
            key={`${sortBy}-${sortOrder}`}
            baseUrl={baseUrl || ''}
            itemCount={itemCount}
            libraryId={libraryId}
            params={{ sortBy, sortOrder }}
        />
    );
}
