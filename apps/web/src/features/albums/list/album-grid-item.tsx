import { useCallback, useMemo } from 'react';
import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import clsx from 'clsx';
import { motion } from 'motion/react';
import type { AlbumItem, TrackItem } from '@/api/api-types.ts';
import { useGetApiLibraryIdAlbumsIdTracksSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { ListTableItem } from '@/features/shared/list/list-table-item.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useImageColor } from '@/hooks/use-image-color.ts';
import styles from './album-grid-item.module.scss';

export function ExpandedAlbumGridItemContent({
    libraryId,
    data,
    context,
}: {
    context: { libraryId: string; listKey: string };
    data: AlbumItem;
    libraryId: string;
}) {
    const { data: tracks } = useGetApiLibraryIdAlbumsIdTracksSuspense(libraryId, data.id, {
        sortBy: TrackListSortOptions.ID,
        sortOrder: ListSortOrder.ASC,
    });

    const baseUrl = useAuthBaseUrl();

    const imageUrl = `${baseUrl}${data.imageUrl}&size=300`;

    const color = useImageColor(imageUrl);

    const columnOrder = [
        ItemListColumn.TRACK_NUMBER,
        ItemListColumn.NAME,
        ItemListColumn.DURATION,
        ItemListColumn.ACTIONS,
    ];

    const { columns } = useItemTable(columnOrder);

    const rows: TrackItem[] = useMemo(() => {
        return tracks?.data.map((track, index) => ({
            ...track,
            index,
        }));
    }, [tracks]);

    const getItemId = useCallback((_index: number, item: TrackItem) => {
        return item.id;
    }, []);

    if (!color) {
        return null;
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
            variants={animationVariants.slideInDown}
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
                <div className={clsx(styles.tracks, { [styles.dark]: color.isDark })}>
                    <ItemTable
                        disableAutoScroll
                        ItemComponent={ListTableItem}
                        columnOrder={columnOrder}
                        columns={columns}
                        context={context}
                        data={rows}
                        enableDragItem={true}
                        enableHeader={false}
                        enableItemBorder={false}
                        enableMultiRowSelection={true}
                        getItemId={getItemId}
                        itemCount={rows.length}
                        itemSize="condensed"
                        itemType={LibraryItemType.TRACK}
                        onChangeColumnOrder={() => {}}
                    />
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
