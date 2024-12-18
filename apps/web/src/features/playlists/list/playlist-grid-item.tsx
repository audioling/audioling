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
    const { context, data, index, isExpanded } = props;

    if (isExpanded && data) {
        return null;
    }

    if (data) {
        return (
            <PlaylistCard
                componentState="loaded"
                id={data.id}
                image={`${context.baseUrl}${data.imageUrl}&size=400`}
                libraryId={context.libraryId}
                metadata={[]}
                // metadata={[{ path: '/', text: data.artists[0]?.name }]}
                metadataLines={1}
                titledata={{ path: '/', text: data.name }}
            />
        );
    }

    return (
        <PlaylistCard
            componentState="loading"
            id={index.toString()}
            image=""
            libraryId={context.libraryId}
            metadata={[]}
            metadataLines={1}
            titledata={{ path: '/', text: '' }}
        />
    );
}

export const MemoizedPlaylistGridItem = memo(PlaylistGridItem);
