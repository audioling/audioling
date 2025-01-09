import { Suspense } from 'react';
import type { ArtistItem } from '@/api/api-types.ts';
import { useGetApiLibraryIdAlbumArtistsSuspense } from '@/api/openapi-generated/album-artists/album-artists.ts';
import type { GetApiLibraryIdAlbumArtistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import {
    type ArtistGridItemContext,
    MemoizedArtistGridItem,
} from '@/features/artists/list/artist-grid-item.tsx';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { Paper } from '@/features/ui/paper/paper.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination } from '@/hooks/use-list.ts';

interface PaginatedArtistGridProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdAlbumArtistsParams;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function PaginatedArtistGrid(props: PaginatedArtistGridProps) {
    const { itemCount, listKey, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <Suspense fallback={<FullPageSpinner />}>
                <ListWrapper listKey={listKey}>
                    <PaginatedArtistGridContent {...props} />
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

function PaginatedArtistGridContent(props: PaginatedArtistGridProps) {
    const { baseUrl, itemCount, libraryId, params, pagination } = props;

    const { data: fetchedData } = useGetApiLibraryIdAlbumArtistsSuspense(libraryId, {
        ...params,
        limit: pagination.itemsPerPage.toString(),
        offset: ((pagination.currentPage - 1) * pagination.itemsPerPage).toString(),
    });

    return (
        <InfiniteItemGrid<ArtistItem, ArtistGridItemContext>
            enableExpanded
            GridComponent={MemoizedArtistGridItem}
            context={{ baseUrl, libraryId }}
            data={fetchedData.data}
            itemCount={itemCount}
        />
    );
}
