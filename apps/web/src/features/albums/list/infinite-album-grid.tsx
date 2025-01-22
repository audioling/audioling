import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdAlbumsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { AlbumGridItem } from '@/features/albums/list/album-grid-item.tsx';
import type { InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import { useInfiniteListData } from '@/hooks/use-list.ts';

interface InfiniteAlbumGridProps extends InfiniteItemListProps<GetApiLibraryIdAlbumsParams> {}

export function InfiniteAlbumGrid(props: InfiniteAlbumGridProps) {
    const { itemCount, libraryId, listKey, pagination, params } = props;

    const { data, handleRangeChanged } = useInfiniteListData({
        itemCount,
        libraryId,
        listKey,
        pagination,
        params,
        type: LibraryItemType.ALBUM,
    });

    return (
        <InfiniteItemGrid<string>
            enableExpanded
            ItemComponent={AlbumGridItem}
            context={{ libraryId, listKey }}
            data={data}
            itemCount={itemCount}
            onRangeChanged={handleRangeChanged}
        />
    );
}
