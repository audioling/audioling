import { Suspense } from 'react';
import type { AlbumItem } from '@/api/api-types.ts';
import { useGetApiLibraryIdAlbumsSuspense } from '@/api/openapi-generated/albums/albums.ts';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import type { AlbumGridItemContext } from '@/features/albums/list/album-grid-item.tsx';
import { MemoizedAlbumGridItem } from '@/features/albums/list/album-grid-item.tsx';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { Paper } from '@/features/ui/paper/paper.tsx';
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
    const { itemCount, listKey, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <Suspense fallback={<FullPageSpinner />}>
                <ListWrapper listKey={listKey}>
                    <PaginatedAlbumGridContent {...props} />
                </ListWrapper>
            </Suspense>
            <Paper>
                <Pagination
                    currentPage={pagination.currentPage}
                    itemCount={itemCount}
                    itemsPerPage={pagination.itemsPerPage}
                    justify="end"
                    variant="outline"
                    {...paginationProps}
                />
            </Paper>
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
        <InfiniteItemGrid<AlbumItem, AlbumGridItemContext>
            enableExpanded
            GridComponent={MemoizedAlbumGridItem}
            context={{ baseUrl, libraryId }}
            data={fetchedData.data}
            itemCount={itemCount}
        />
    );
}
