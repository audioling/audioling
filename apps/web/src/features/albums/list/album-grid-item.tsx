import { useCallback, useMemo } from 'react';
import { LibraryItemType, ListSortOrder, TrackListSortOptions } from '@repo/shared-types';
import type { Row, Table } from '@tanstack/react-table';
import clsx from 'clsx';
import { motion } from 'motion/react';
import type { AlbumItem, TrackItem } from '@/api/api-types.ts';
import { useGetApiLibraryIdAlbumsIdTracksSuspense } from '@/api/openapi-generated/albums/albums.ts';
import { useAuthBaseUrl } from '@/features/authentication/stores/auth-store.ts';
import { TrackTableItem } from '@/features/tracks/list/track-table-item.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { useItemTable } from '@/features/ui/item-list/item-table/hooks/use-item-table.ts';
import { useMultiRowSelection } from '@/features/ui/item-list/item-table/hooks/use-table-row-selection.ts';
import { ItemTable } from '@/features/ui/item-list/item-table/item-table.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useImageColor } from '@/hooks/use-image-color.ts';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragOperation, DragTarget } from '@/utils/drag-drop.ts';
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

    const { columns } = useItemTable<TrackItem | undefined>(columnOrder, () => {});

    const { onRowClick } = useMultiRowSelection<TrackItem>();

    const onRowDragData = useCallback(
        (row: Row<TrackItem>, table: Table<TrackItem | undefined>): DragData => {
            const isSelfSelected = row.getIsSelected();

            if (isSelfSelected) {
                const selectedRows = table.getSelectedRowModel().rows;

                const selectedRowIds = [];
                const selectedItems = [];

                for (const row of selectedRows) {
                    selectedRowIds.push(row.id);
                    selectedItems.push(row.original);
                }

                return dndUtils.generateDragData({
                    id: selectedRowIds,
                    item: selectedItems,
                    operation: [DragOperation.ADD],
                    type: DragTarget.TRACK,
                });
            }

            return dndUtils.generateDragData({
                id: [row.id],
                item: [row.original],
                operation: [DragOperation.ADD],
                type: DragTarget.TRACK,
            });
        },
        [],
    );

    const rows: TrackItem[] = useMemo(() => {
        return tracks?.data.map((track, index) => ({
            ...track,
            index,
        }));
    }, [tracks]);

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
                        enableMultiRowSelection
                        enableRowSelection
                        ItemComponent={TrackTableItem}
                        columnOrder={columnOrder}
                        columns={columns}
                        context={context}
                        data={rows}
                        enableHeader={false}
                        itemCount={rows.length}
                        itemType={LibraryItemType.TRACK}
                        onChangeColumnOrder={() => {}}
                        onRowClick={onRowClick}
                        onRowDragData={onRowDragData}
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
