import type { AppDBType } from '/@/api/app-db';
import type { ItemCardProps } from '/@/features/shared/components/item-card/item-card';
import type { ItemListInternalState } from '/@/features/shared/components/item-list/utils/helpers';
import type { ServerItemType } from '@repo/shared-types/app-types';
import { useAppDBItem } from '/@/api/app-db';
import { ItemCard } from '/@/features/shared/components/item-card/item-card';

export interface InnerServerGridItemProps<T> {
    context: unknown;
    data: string | undefined;
    index: number;
    lines?: ItemCardProps<T>['lines'];
    onContextMenu?: ItemCardProps<T>['onContextMenu'];
    onDragInitialData?: ItemCardProps<T>['onDragInitialData'];
    onDragStart?: ItemCardProps<T>['onDragStart'];
    onDrop?: ItemCardProps<T>['onDrop'];
    onFavorite?: ItemCardProps<T>['onFavorite'];
    onPlay?: ItemCardProps<T>['onPlay'];
    onUnfavorite?: ItemCardProps<T>['onUnfavorite'];
    type?: ItemCardProps<T>['type'];
}

export function InnerServerGridItem<T>(props: InnerServerGridItemProps<T>) {
    const {
        context,
        data: id,
        index,
        onContextMenu,
        onDragInitialData,
        onDragStart,
        onDrop,
        onFavorite,
        onPlay,
        onUnfavorite,
    } = props;

    const { displayType, itemSelection, itemType, lines, onItemSelection, reducers } = context as {
        displayType: ItemCardProps<T>['type'];
        itemSelection: ItemListInternalState['itemSelection'];
        itemType: ServerItemType;
        lines: ItemCardProps<T>['lines'];
        onItemSelection: ItemListInternalState['_onMultiSelectionClick']
            | ItemListInternalState['_onSingleSelectionClick'];
        reducers: ItemListInternalState['reducers'];
    };

    const isSelected = Boolean(id ? itemSelection[id] : undefined);
    const isDragging = reducers.getIsDragging() && isSelected;

    const { data } = useAppDBItem(itemType as AppDBType, id);

    return (
        <ItemCard
            data={data as T}
            id={id}
            index={index}
            isDragging={isDragging}
            isSelected={isSelected}
            lines={lines}
            reducers={reducers}
            type={displayType}
            onContextMenu={onContextMenu}
            onDragInitialData={onDragInitialData}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onFavorite={onFavorite}
            onItemSelection={onItemSelection}
            onPlay={onPlay}
            onUnfavorite={onUnfavorite}
        />
    );
}
