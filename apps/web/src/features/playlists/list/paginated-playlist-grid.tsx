import { Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import type { PlaylistItem } from '@/api/api-types.ts';
import type { GetApiLibraryIdPlaylistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { useGetApiLibraryIdPlaylistsSuspense } from '@/api/openapi-generated/playlists/playlists.ts';
import type { PlaylistGridItemContext } from '@/features/playlists/list/playlist-grid-item.tsx';
import { MemoizedPlaylistGridItem } from '@/features/playlists/list/playlist-grid-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import type { ItemListPaginationState } from '@/features/ui/item-list/types.ts';
import { Pagination } from '@/features/ui/pagination/pagination.tsx';
import { EmptyPlaceholder } from '@/features/ui/placeholders/empty-placeholder.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { useListPagination } from '@/hooks/use-list.ts';

interface PaginatedPlaylistGridProps {
    baseUrl: string;
    itemCount: number;
    libraryId: string;
    listKey: string;
    pagination: ItemListPaginationState;
    params: GetApiLibraryIdPlaylistsParams;
    setPagination: (pagination: ItemListPaginationState) => void;
}

export function PaginatedPlaylistGrid(props: PaginatedPlaylistGridProps) {
    const { itemCount, listKey, pagination, setPagination } = props;
    const paginationProps = useListPagination({ pagination, setPagination });

    return (
        <Stack h="100%">
            <Suspense fallback={<EmptyPlaceholder />}>
                <AnimatePresence mode="wait">
                    <ListWrapper key={listKey}>
                        <PaginatedPlaylistGridContent {...props} />
                    </ListWrapper>
                </AnimatePresence>
            </Suspense>
            <Pagination
                currentPage={pagination.currentPage}
                itemCount={itemCount}
                itemsPerPage={pagination.itemsPerPage}
                justify="end"
                {...paginationProps}
            />
        </Stack>
    );
}

function PaginatedPlaylistGridContent(props: PaginatedPlaylistGridProps) {
    const { baseUrl, itemCount, libraryId, params, pagination } = props;

    const { data: fetchedData } = useGetApiLibraryIdPlaylistsSuspense(libraryId, {
        ...params,
        limit: pagination.itemsPerPage.toString(),
        offset: ((pagination.currentPage - 1) * pagination.itemsPerPage).toString(),
    });

    return (
        <InfiniteItemGrid<PlaylistItem, PlaylistGridItemContext>
            GridComponent={MemoizedPlaylistGridItem}
            context={{ baseUrl, libraryId }}
            data={fetchedData.data}
            itemCount={itemCount}
        />
    );
}
