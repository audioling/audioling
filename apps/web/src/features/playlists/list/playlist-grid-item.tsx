import { memo } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import type { PlaylistItem } from '@/api/api-types.ts';
import { PlaylistCard } from '@/features/playlists/components/playlist-card.tsx';
import type { InfiniteGridItemProps } from '@/features/ui/item-list/item-grid/item-grid.tsx';

export type PlaylistGridItemContext = {
    baseUrl: string;
    libraryId: string;
};

export function PlaylistGridItem(
    props: InfiniteGridItemProps<PlaylistItem, PlaylistGridItemContext>,
) {
    const { data } = props;

    if (data) {
        return (
            <PlaylistCard
                componentState="loaded"
                id={data.id}
                image={data.imageUrl}
                itemType={LibraryItemType.PLAYLIST}
                metadata={[]}
                metadataLines={0}
                titledata={{ path: '/', text: data.name }}
            />
        );
    }

    return <PlaylistCard componentState="loading" metadataLines={0} />;
}

export const MemoizedPlaylistGridItem = memo(PlaylistGridItem);
