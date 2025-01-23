import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdAlbumArtistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { ListGridServerItem } from '@/features/shared/list/list-grid-server-item.tsx';
import { ListWrapper } from '@/features/shared/list-wrapper/list-wrapper.tsx';
import type { InfiniteItemListProps } from '@/features/ui/item-list/helpers.ts';
import { InfiniteItemGrid } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import { useInfiniteListData } from '@/hooks/use-list.ts';

interface InfiniteAlbumArtistGridProps
    extends InfiniteItemListProps<GetApiLibraryIdAlbumArtistsParams> {}

export function InfiniteAlbumArtistGrid(props: InfiniteAlbumArtistGridProps) {
    const { listKey } = props;

    return (
        <ListWrapper listKey={listKey}>
            <InfiniteAlbumArtistGridContent {...props} />
        </ListWrapper>
    );
}

export function InfiniteAlbumArtistGridContent({
    itemCount,
    libraryId,
    listKey,
    pagination,
    params,
}: InfiniteAlbumArtistGridProps) {
    const { data, handleRangeChanged } = useInfiniteListData({
        itemCount,
        libraryId,
        listKey,
        pagination,
        params,
        type: LibraryItemType.ALBUM_ARTIST,
    });

    return (
        <InfiniteItemGrid<string>
            ItemComponent={ListGridServerItem}
            context={{ libraryId, listKey }}
            data={data}
            enableExpanded={false}
            itemCount={itemCount}
            itemType={LibraryItemType.ALBUM_ARTIST}
            onRangeChanged={handleRangeChanged}
        />
    );
}
