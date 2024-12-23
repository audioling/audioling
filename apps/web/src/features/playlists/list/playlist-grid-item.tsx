import { memo } from 'react';
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
    const { context, data } = props;

    if (data) {
        return (
            <PlaylistCard
                componentState="loaded"
                id={data.id}
                image={`${context.baseUrl}${data.imageUrl}&size=300`}
                libraryId={context.libraryId}
                metadata={[]}
                metadataLines={1}
                titledata={{ path: '/', text: data.name }}
            />
        );
    }

    return <PlaylistCard componentState="loading" metadataLines={1} />;
}

export const MemoizedPlaylistGridItem = memo(PlaylistGridItem);
