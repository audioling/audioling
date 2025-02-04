import { Suspense } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdAlbumArtistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { FullPageSpinner } from '@/features/shared/full-page-spinner/full-page-spinner.tsx';
import { ListGridServerItem } from '@/features/shared/list/list-grid-server-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { PaginatedItemListProps } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { Paper } from '@/features/ui/paper/paper.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination, usePaginatedListData } from '@/hooks/use-list.ts';

interface PaginatedAlbumArtistGridProps
    extends PaginatedItemListProps<GetApiLibraryIdAlbumArtistsParams> {}

export function PaginatedAlbumArtistGrid(props: PaginatedAlbumArtistGridProps) {
    const { itemCount, listKey, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <Suspense fallback={<FullPageSpinner />}>
                <ListWrapper listKey={listKey}>
                    <PaginatedAlbumArtistGridContent {...props} />
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

function PaginatedAlbumArtistGridContent(props: PaginatedAlbumArtistGridProps) {
    const { itemCount, libraryId, listKey, params, pagination } = props;

    const { data } = usePaginatedListData({
        libraryId,
        pagination,
        params,
        type: LibraryItemType.ALBUM_ARTIST,
    });

    return (
        <InfiniteItemGrid<string>
            enableExpanded
            ItemComponent={ListGridServerItem}
            context={{ libraryId, listKey }}
            data={data}
            itemCount={itemCount}
            itemType={LibraryItemType.ALBUM_ARTIST}
        />
    );
}
