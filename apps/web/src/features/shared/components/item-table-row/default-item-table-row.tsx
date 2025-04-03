import type { ItemTableRowProps } from '/@/features/shared/components/item-table-row/item-table-row';
import type { MouseEvent } from 'react';
import { useMemo } from 'react';
import styles from './default-item-table-row.module.css';

export function DefaultItemTableRow<T>({
    columns,
    data,
    id,
    index,
    isDragging,
    isSelected,
    itemType,
    onClick,
    onContextMenu,
    onDragInitialData,
    onDragStart,
    onDrop,
    onFavorite,
    onItemSelection,
    onPlay,
    onUnfavorite,
    reducers,
}: ItemTableRowProps<T>) {
    const item = useMemo(() => ({
        id: id as string,
        serverId: (data as any)?._serverId || '',
    }), [id, data]);

    return (
        <div
            className={styles.tableRow}
            onClick={e => onClick?.(item, e as unknown as MouseEvent<HTMLDivElement>, reducers)}
        >
            {columns.map(column => (
                <column.cell
                    key={column.id}
                    id={id}
                    index={index}
                    isSelected={isSelected}
                    item={data}
                    itemType={itemType}
                    reducers={reducers}
                />
            ))}
        </div>
    );
}
