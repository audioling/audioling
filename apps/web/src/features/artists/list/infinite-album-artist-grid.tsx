import { LibraryItemType } from '@repo/shared-types';
import type { GetApiLibraryIdAlbumArtistsParams } from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { AlbumArtistGridItem } from '@/features/artists/list/album-artist-grid-item.tsx';
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
            ItemComponent={AlbumArtistGridItem}
            context={{ libraryId, listKey }}
            data={data}
            enableExpanded={false}
            itemCount={itemCount}
            onRangeChanged={handleRangeChanged}
        />
    );
}
