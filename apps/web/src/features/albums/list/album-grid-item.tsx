import { memo } from 'react';
import type { AlbumItem } from '@/api/api-types.ts';
import { AlbumCard } from '@/features/ui/card/album-card.tsx';
import type { InfiniteGridItemProps } from '@/features/ui/item-list/item-grid/item-grid.tsx';

export type AlbumGridItemContext = {
    baseUrl: string;
    libraryId: string;
};

export function AlbumGridItem(props: InfiniteGridItemProps<AlbumItem, AlbumGridItemContext>) {
    const { context, data, index } = props;

    if (data) {
        return (
            <AlbumCard
                componentState="loaded"
                id={data.id}
                image={`${context?.baseUrl}${data.imageUrl}&size=300`}
                metadata={[{ path: '/', text: data.artists[0]?.name }]}
                metadataLines={1}
                titledata={{ path: '/', text: data.name }}
            />
        );
    }

    return (
        <AlbumCard
            componentState="loading"
            id={index.toString()}
            image=""
            metadata={[]}
            metadataLines={1}
            titledata={{ path: '/', text: '' }}
        />
    );
}

export const MemoizedAlbumGridItem = memo(AlbumGridItem);
