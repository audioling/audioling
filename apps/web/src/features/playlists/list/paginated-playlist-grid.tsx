import { Suspense } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdPlaylistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { ListGridServerItem } from '@/features/shared/list/list-grid-server-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { PaginatedItemListProps } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import { PaginationWithCount } from '@/features/ui/pagination/pagination.tsx';
import { EmptyPlaceholder } from '@/features/ui/placeholders/empty-placeholder.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination, usePaginatedListData } from '@/hooks/use-list.ts';

interface PaginatedPlaylistGridProps
    extends PaginatedItemListProps<GetApiLibraryIdPlaylistsParams> {}

export function PaginatedPlaylistGrid(props: PaginatedPlaylistGridProps) {
    const { itemCount, listKey, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <Suspense fallback={<EmptyPlaceholder />}>
                <ListWrapper listKey={listKey}>
                    <PaginatedPlaylistGridContent {...props} />
                </ListWrapper>
            </Suspense>
            <PaginationWithCount
                currentPage={pagination.currentPage}
                itemCount={itemCount}
                itemsPerPage={pagination.itemsPerPage}
                justify="end"
                onItemsPerPageChange={(e) => {
                    setPagination({
                        ...pagination,
                        itemsPerPage: parseInt(e),
                    });
                }}
                {...paginationProps}
            />
        </Stack>
    );
}

function PaginatedPlaylistGridContent(props: PaginatedPlaylistGridProps) {
    const { itemCount, libraryId, listKey, params, pagination } = props;

    const { data } = usePaginatedListData({
        libraryId,
        pagination,
        params,
        type: LibraryItemType.PLAYLIST,
    });

    return (
        <InfiniteItemGrid<string>
            ItemComponent={ListGridServerItem}
            context={{ libraryId, listKey }}
            data={data}
            itemCount={itemCount}
            itemType={LibraryItemType.PLAYLIST}
        />
    );
}
