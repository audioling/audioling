import { memo } from 'react';
import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import clsx from 'clsx';
import { motion } from 'motion/react';
import type { AlbumItem, TrackItem } from '@/api/api-types.ts';
import { useGetApiLibraryIdAlbumsIdTracksSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import type { PlayType } from '@/features/player/stores/player-store.tsx';
import { AlbumCard } from '@/features/ui/card/album-card.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { InfiniteGridItemProps } from '@/features/ui/item-list/item-grid/item-grid.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useImageColor } from '@/hooks/use-image-color.ts';
import { formatDuration } from '@/utils/format-duration.ts';
import styles from './album-grid-item.module.scss';

export type AlbumGridItemContext = {
    baseUrl: string;
    libraryId: string;
};

export function AlbumGridItem(props: InfiniteGridItemProps<AlbumItem, AlbumGridItemContext>) {
    const { context, data, index, isExpanded } = props;

    if (isExpanded && data) {
        return (
            <ExpandedAlbumGridItemContent
                context={context}
                data={data}
                libraryId={context.libraryId}
            />
        );
    }

    const handlePlay = (id: string, playType: PlayType) => {
        PlayerController.call({
            cmd: {
                addToQueueByFetch: { id: [id], itemType: LibraryItemType.ALBUM, type: playType },
            },
        });
    };

    if (data) {
        return (
            <AlbumCard
                componentState="loaded"
                controls={{
                    onMore: () => {},
                    onPlay: handlePlay,
                }}
                id={data.id}
                image={`${context.baseUrl}${data.imageUrl}&size=400`}
                libraryId={context.libraryId}
                metadata={[{ path: '/', text: data.artists[0]?.name }]}
                metadataLines={1}
                titledata={{ path: '/', text: data.name }}
            />
        );
    }

    return (
        <AlbumCard
            componentState="loading"
            controls={{
                onMore: () => {},
                onPlay: () => {},
            }}
            id={index.toString()}
            image=""
            libraryId={context.libraryId}
            metadata={[]}
            metadataLines={1}
            titledata={{ path: '/', text: '' }}
        />
    );
}

export const MemoizedAlbumGridItem = memo(AlbumGridItem);

function ExpandedAlbumGridItemContent({
    libraryId,
    data,
    context,
}: {
    context: AlbumGridItemContext;
    data: AlbumItem;
    libraryId: string;
}) {
    const { data: tracks } = useGetApiLibraryIdAlbumsIdTracksSuspense(libraryId, data.id, {
        sortBy: TrackListSortOptions.NAME,
        sortOrder: ListSortOrder.ASC,
    });

    const imageUrl = `${context.baseUrl}${data.imageUrl}&size=400`;

    const color = useImageColor(imageUrl);

    if (!color) {
        return null;
    }

    return (
        <motion.div
            className={styles.expanded}
            style={{
                backgroundColor: color?.rgb,
                color: color.isDark ? 'white' : 'black',
            }}
        >
            <div className={styles.content}>
                <div className={styles.header}>
                    <Title className={styles.itemTitle} order={1} size="lg" weight="lg">
                        {data.name}
                    </Title>
                    <Title order={2} size="sm" weight="md">
                        {data.artists[0]?.name}
                    </Title>
                </div>
                <ScrollArea>
                    <div className={styles.tracks}>
                        {tracks?.data?.map((track, index) => (
                            <RowItem
                                key={track.id}
                                index={index}
                                isDark={color.isDark}
                                track={track}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
            <div
                className={styles.imageContainer}
                style={{
                    ['--bg-color' as string]: color?.rgb,
                    backgroundImage: `url(${imageUrl})`,
                }}
            />
        </motion.div>
    );
}

function RowItem({ index, track, isDark }: { index: number; isDark: boolean; track: TrackItem }) {
    return (
        <div
            className={clsx(styles.track, {
                [styles.dark]: isDark,
            })}
        >
            <Text size="md" weight="lg">
                {index + 1}
            </Text>
            <Text className={styles.trackName} size="md" weight="lg">
                {track.name}
            </Text>
            <Text size="md">{formatDuration(track.duration)}</Text>
            <IconButton icon="ellipsisHorizontal" size="xs" variant="transparent" />
        </div>
    );
}
