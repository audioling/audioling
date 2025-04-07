import type { ItemTableRowProps } from '/@/features/shared/components/item-table-row/item-table-row';
import type { DragData } from '/@/utils/drag-drop';
import type { MouseEvent } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './default-item-table-row.module.css';
import { DragPreview } from '/@/components/drag-preview/drag-preview';
import { PlayType } from '/@/stores/player-store';

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
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const item = useMemo(() => ({
        id: id as string,
        serverId: (data as any)?._serverId || '',
    }), [id, data]);

    useEffect(() => {
        if (!ref.current || !id || !data) {
            return;
        }

        return combine(
            draggable({
                element: ref.current,
                getInitialData: () => {
                    return onDragInitialData?.(item, reducers) ?? {};
                },
                onDragStart: async () => {
                    reducers?.setIsDragging(true);
                    return onDragStart?.(item, reducers);
                },
                onDrop: () => {
                    reducers?.setIsDragging(false);
                },
                onGenerateDragPreview: (data) => {
                    disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                    setCustomNativeDragPreview({
                        nativeSetDragImage: data.nativeSetDragImage,
                        render: ({ container }) => {
                            const root = createRoot(container);
                            root.render(
                                <DragPreview itemCount={(data.source.data as unknown as DragData<any>).id.length} />,
                            );
                        },
                    });
                },
            }),
        );
    }, [onDragInitialData, onDragStart, onDrop, data, id, isHovered, reducers, item]);

    return (
        <div
            ref={ref}
            className={clsx(styles.tableRow, {
                [styles.selected]: isSelected,
                [styles.dragging]: isDragging,
            })}
            onClick={(e) => {
                onClick?.(item, e as unknown as MouseEvent<HTMLDivElement>, reducers);
            }}
            onContextMenu={(e) => {
                onContextMenu?.(item, e as unknown as MouseEvent<HTMLButtonElement>, reducers);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {columns.map(column => (
                <column.cell
                    key={column.id}
                    data={data}
                    id={id}
                    index={index}
                    isHovered={isHovered}
                    isSelected={isSelected}
                    item={item}
                    itemType={itemType}
                    reducers={reducers}
                    onFavorite={() => {
                        onFavorite?.(item);
                    }}
                    onItemContextMenu={(e) => {
                        onContextMenu?.(item, e as unknown as MouseEvent<HTMLButtonElement>, reducers);
                    }}
                    onItemSelection={(e) => {
                        onItemSelection?.(item, index, (e.nativeEvent as unknown as MouseEvent<HTMLButtonElement>));
                    }}
                    onPlay={() => {
                        onPlay?.(item, PlayType.NOW);
                    }}
                    onUnfavorite={() => {
                        onUnfavorite?.(item);
                    }}
                />
            ))}
        </div>
    );
}
