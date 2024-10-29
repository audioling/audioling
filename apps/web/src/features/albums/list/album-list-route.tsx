import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types';
import { useParams } from 'react-router-dom';
import { useGetApiLibraryIdAlbumsCountSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { InfiniteAlbumGrid } from '@/features/albums/list/infinite-album-grid.tsx';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';

export function AlbumListRoute() {
    const { libraryId } = useParams() as { libraryId: string };
    const baseUrl = useAuthBaseUrl();

    const { data: itemCount } = useGetApiLibraryIdAlbumsCountSuspense(libraryId, {
        sortBy: AlbumListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <InfiniteAlbumGrid
                baseUrl={baseUrl || ''}
                itemCount={itemCount}
                libraryId={libraryId}
                params={{ sortBy: AlbumListSortOptions.NAME, sortOrder: ListSortOrder.ASC }}
            />
        </div>
    );
}
