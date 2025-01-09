import { memo } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { ArtistItem } from '@/api/api-types.ts';
import { AlbumCard } from '@/features/albums/components/album-card.tsx';
import { ArtistCard } from '@/features/artists/components/artist-card.tsx';
import type { InfiniteGridItemProps } from '@/features/ui/item-list/item-grid/item-grid.tsx';

export type ArtistGridItemContext = {
    baseUrl: string;
    libraryId: string;
};

export function ArtistGridItem(props: InfiniteGridItemProps<ArtistItem, ArtistGridItemContext>) {
    const { data } = props;

    if (data) {
        return (
            <ArtistCard
                componentState="loaded"
                id={data.id}
                image={data.imageUrl}
                itemType={LibraryItemType.ALBUM_ARTIST}
                metadata={[]}
                metadataLines={1}
                titledata={{ path: '/', text: data.name }}
            />
        );
    }

    return <AlbumCard componentState="loading" metadataLines={1} />;
}

export const MemoizedArtistGridItem = memo(ArtistGridItem);
