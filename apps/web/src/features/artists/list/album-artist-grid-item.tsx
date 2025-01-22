import { LibraryItemType } from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import type { AlbumArtistItem } from '@/api/api-types.ts';
import { AlbumArtistCard } from '@/features/artists/components/album-artist-card.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { InfiniteGridItemProps } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import type { ItemListQueryData } from '@/hooks/use-list.ts';

export function AlbumArtistGridItem(props: InfiniteGridItemProps<string>) {
    const { context, data: uniqueId } = props;

    const { data: list } = useQuery<ItemListQueryData>({
        enabled: false,
        queryKey: itemListHelpers.getQueryKey(
            context.libraryId,
            context.listKey,
            LibraryItemType.ALBUM_ARTIST,
        ),
    });

    if (!uniqueId || !list) {
        return <AlbumArtistCard componentState="loading" metadataLines={0} />;
    }

    const data = list.data[list.uniqueIdToId[uniqueId]] as AlbumArtistItem | undefined;

    if (!data) {
        return <AlbumArtistCard componentState="loading" metadataLines={0} />;
    }

    return (
        <AlbumArtistCard
            albumArtist={data}
            componentState="loaded"
            id={uniqueId}
            libraryId={context.libraryId}
            metadataLines={0}
        />
    );
}
