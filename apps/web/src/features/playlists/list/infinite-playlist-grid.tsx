import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdPlaylistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { ListGridServerItem } from '@/features/shared/list/list-grid-server-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import { useInfiniteListData } from '@/hooks/use-list.ts';

interface InfinitePlaylistGridProps extends InfiniteItemListProps<GetApiLibraryIdPlaylistsParams> {}

export function InfinitePlaylistGrid(props: InfinitePlaylistGridProps) {
    const { listKey } = props;

    return (
        <ListWrapper listKey={listKey}>
            <InfinitePlaylistGridContent {...props} />
        </ListWrapper>
    );
}

export function InfinitePlaylistGridContent({
    itemCount,
    libraryId,
    listKey,
    pagination,
    params,
}: InfinitePlaylistGridProps) {
    const { data, handleRangeChanged } = useInfiniteListData({
        itemCount,
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
            onRangeChanged={handleRangeChanged}
        />
    );
}
