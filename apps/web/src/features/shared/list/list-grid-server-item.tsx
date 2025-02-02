import { LibraryItemType } from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import type { AlbumArtistItem, AlbumItem, PlaylistItem } from '@/api/api-types.ts';
import { AlbumCard } from '@/features/albums/components/album-card.tsx';
import { ExpandedAlbumGridItemContent } from '@/features/albums/list/album-grid-item.tsx';
import { AlbumArtistCard } from '@/features/artists/components/album-artist-card.tsx';
import { PlaylistCard } from '@/features/playlists/components/playlist-card.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { InfiniteGridItemProps } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import type { ItemQueryData } from '@/hooks/use-list.ts';

export function ListGridServerItem(props: InfiniteGridItemProps<string>) {
    return <InnerContent {...props} />;
}

function InnerContent(props: InfiniteGridItemProps<string>) {
    const { context, data: id, isExpanded, itemType } = props;

    const { data: itemData } = useQuery<ItemQueryData>({
        enabled: false,
        queryKey: itemListHelpers.getDataQueryKey(context.libraryId, itemType),
    });

    let data = undefined;

    switch (itemType) {
        case LibraryItemType.ALBUM_ARTIST:
            if (!id) {
                return <AlbumArtistCard componentState="loading" metadataLines={0} />;
            }

            data = itemData?.[id] as AlbumArtistItem | undefined;

            if (!data) {
                return <AlbumArtistCard componentState="loading" metadataLines={0} />;
            }

            return (
                <AlbumArtistCard
                    albumArtist={data}
                    componentState="loaded"
                    id={id}
                    libraryId={context.libraryId}
                    metadataLines={0}
                />
            );
        case LibraryItemType.ALBUM:
            if (!id) {
                return <AlbumCard componentState="loading" metadataLines={1} />;
            }

            data = itemData?.[id] as AlbumItem | undefined;

            if (!data) {
                return <AlbumCard componentState="loading" metadataLines={1} />;
            }

            if (isExpanded) {
                return (
                    <ExpandedAlbumGridItemContent
                        context={context}
                        data={data}
                        libraryId={context.libraryId}
                    />
                );
            }

            return (
                <AlbumCard
                    album={data}
                    componentState="loaded"
                    id={data.id}
                    libraryId={context.libraryId}
                    metadataLines={1}
                />
            );
        case LibraryItemType.PLAYLIST:
            if (!id) {
                return <PlaylistCard componentState="loading" metadataLines={0} />;
            }

            data = itemData?.[id] as PlaylistItem | undefined;

            if (!data) {
                return <PlaylistCard componentState="loading" metadataLines={0} />;
            }

            return (
                <PlaylistCard
                    componentState="loaded"
                    id={id}
                    itemType={LibraryItemType.PLAYLIST}
                    libraryId={context.libraryId}
                    metadataLines={0}
                    playlist={data}
                />
            );
        default:
            return null;
    }
}

// function MemoizedListGridServerItem(props: InfiniteGridItemProps<string>) {
//     return <InnerContent {...props} />;
// }
