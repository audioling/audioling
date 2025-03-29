import { Table, Text, Title } from '@mantine/core';
import { adapterAPI } from '@repo/adapter-api';
import { ListSortOrder, ServerItemType, TrackListSortOptions } from '@repo/shared-types/app-types';
import clsx from 'clsx';
import { motion } from 'motion/react';
import styles from './expanded-album-list-content.module.css';
import { animationVariants } from '/@/components/animations/variants';
import { useAlbumDetail } from '/@/features/albums/api/get-album-detail';
import { useAlbumTrackList } from '/@/features/albums/api/get-album-track-list';
import { useAppContext } from '/@/features/authentication/context/app-context';
import { useImageColor } from '/@/features/shared/hooks/use-image-color';
import { formatDuration } from '/@/utils/format-duration';

export function ExpandedAlbumListContent({
    id,
}: {
    id: string;
}) {
    const { server } = useAppContext();
    const adapter = adapterAPI(server.type);

    const { data: album } = useAlbumDetail(server, {
        query: {
            id,
        },
    });

    const { data: tracks } = useAlbumTrackList(server, {
        query: {
            id,
            limit: -1,
            offset: 0,
            sortBy: TrackListSortOptions.ID,
            sortOrder: ListSortOrder.ASC,
        },
    });

    const imageUrl = adapter._getCoverArtUrl({ id, size: 300, type: ServerItemType.ALBUM }, server);

    let { color, isLoaded: isColorLoaded } = useImageColor(imageUrl);

    // const columnOrder = [
    //     ItemListColumn.TRACK_NUMBER,
    //     ItemListColumn.NAME,
    //     ItemListColumn.ACTIONS,
    // ];

    // const { columns } = useItemTable(columnOrder);

    // const rows: TrackItem[] = useMemo(() => {
    //     return tracks?.data.map((track, index) => ({
    //         ...track,
    //         index,
    //     }));
    // }, [tracks]);

    if (!isColorLoaded) {
        return null;
    }

    if (!color) {
        // Add fallback if no color is found
        color = {
            hex: 'var(--paper-background-color)',
            hexa: 'var(--paper-background-color)',
            isDark: true,
            isLight: false,
            rgb: 'var(--paper-background-color)',
            rgba: 'var(--paper-background-color)',
            value: [0, 0, 0, 0],
        };
    }

    return (
        <motion.div
            animate="show"
            className={styles.expanded}
            exit="hidden"
            initial="hidden"
            style={{
                backgroundColor: color?.rgb,
                color: color.isDark ? 'white' : 'black',
            }}
            variants={animationVariants.fadeIn}
        >
            <div className={styles.content}>
                <div className={styles.header}>
                    <Title className={styles.itemTitle} fw={700} order={1} size="xl">
                        {album.name}
                    </Title>
                    <Text className={styles.itemTitle} fw={600}>
                        {album.artists[0]?.name}
                    </Text>
                </div>
                <div className={clsx(styles.tracks, { [styles.dark]: color.isDark })}>
                    <Table.ScrollContainer minWidth={0}>
                        <Table withRowBorders={false}>
                            <Table.Tbody>
                                {tracks?.items.map(track => (
                                    <Table.Tr key={track.id}>
                                        <Table.Td className={styles.cellIndex}>
                                            <Text>{track.trackNumber}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text>{track.name}</Text>
                                        </Table.Td>
                                        <Table.Td className={styles.cellDuration}>
                                            <Text>{formatDuration(track.duration)}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                    {/* <ItemTable
                        disableAutoScroll
                        enableDragItem
                        enableMultiRowSelection
                        ItemComponent={ListTableItem}
                        columnOrder={columnOrder}
                        columns={columns}
                        context={context}
                        data={rows}
                        enableHeader={false}
                        enableItemBorder={false}
                        getItemId={getItemId}
                        itemCount={rows.length}
                        itemSize="condensed"
                        itemType={LibraryItemType.TRACK}
                        onChangeColumnOrder={() => {}}
                    /> */}
                </div>
            </div>
            <div className={styles.imageContainer}>
                <div
                    className={styles.backgroundImage}
                    style={{
                        ['--bg-color' as string]: color?.rgb,
                        backgroundImage: `url(${imageUrl})`,
                    }}
                />
            </div>
        </motion.div>
    );
}
