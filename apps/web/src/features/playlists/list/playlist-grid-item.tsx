import { memo } from 'react';
import { LibraryItemType } from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import type { PlaylistItem } from '@/api/api-types.ts';
import { PlaylistCard } from '@/features/playlists/components/playlist-card.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';
import type { InfiniteGridItemProps } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import type { ItemListQueryData } from '@/hooks/use-list.ts';

export type PlaylistGridItemContext = {
    baseUrl: string;
    libraryId: string;
};

const InnerPlaylistGridItem = memo(
    (props: InfiniteGridItemProps<string>) => {
        const { context, data: uniqueId } = props;

        const { data: list } = useQuery<ItemListQueryData>({
            enabled: false,
            queryKey: itemListHelpers.getQueryKey(
                context.libraryId,
                context.listKey,
                LibraryItemType.PLAYLIST,
            ),
        });

        if (!uniqueId || !list) {
            return <PlaylistCard componentState="loading" metadataLines={0} />;
        }

        const data = list.data[list.uniqueIdToId[uniqueId]] as PlaylistItem | undefined;

        if (!data) {
            return <PlaylistCard componentState="loading" metadataLines={0} />;
        }

        return (
            <PlaylistCard
                componentState="loaded"
                id={uniqueId}
                itemType={LibraryItemType.PLAYLIST}
                libraryId={context.libraryId}
                metadataLines={0}
                playlist={data}
            />
        );
    },
    (prev, next) => {
        return prev.data === next.data;
    },
);

InnerPlaylistGridItem.displayName = 'InnerPlaylistGridItem';

export function PlaylistGridItem(props: InfiniteGridItemProps<string>) {
    return <InnerPlaylistGridItem {...props} />;
}
