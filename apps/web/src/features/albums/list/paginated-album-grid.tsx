import { Suspense } from 'react';
import type { AlbumItem } from '@/api/api-types.ts';
import { useGetApiLibraryIdAlbumsSuspense } from '@/api/openapi-generated/albums/albums.ts';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import type { AlbumGridItemContext } from '@/features/albums/list/album-grid-item.tsx';
import { MemoizedAlbumGridItem } from '@/features/albums/list/album-grid-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { EmptyPlaceholder } from '@/features/ui/placeholders/empty-placeholder.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination } from '@/hooks/use-list.ts';

interface PaginatedAlbumGridProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdAlbumsParams;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function PaginatedAlbumGrid(props: PaginatedAlbumGridProps) {
    const { itemCount, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <Suspense fallback={<EmptyPlaceholder />}>
                <PaginatedAlbumGridContent {...props} />
            </Suspense>
            <Pagination
                currentPage={pagination.currentPage}
                itemCount={itemCount}
                itemsPerPage={pagination.itemsPerPage}
                {...paginationProps}
            />
        </Stack>
    );
}

function PaginatedAlbumGridContent(props: PaginatedAlbumGridProps) {
    const { baseUrl, itemCount, libraryId, params, pagination } = props;

    const { data: fetchedData } = useGetApiLibraryIdAlbumsSuspense(libraryId, {
        ...params,
        limit: pagination.itemsPerPage.toString(),
        offset: ((pagination.currentPage - 1) * pagination.itemsPerPage).toString(),
    });

    return (
        <ListWrapper id="album-list-content" listKey={props.listKey}>
            <InfiniteItemGrid<AlbumItem, AlbumGridItemContext>
                GridComponent={MemoizedAlbumGridItem}
                context={{ baseUrl, libraryId }}
                data={fetchedData.data}
                itemCount={itemCount}
            />
        </ListWrapper>
    );
}
