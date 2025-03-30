import type { AppDBType } from '/@/api/app-db';
import type { ItemCardProps } from '/@/features/shared/components/item-card/item-card';
import type {
    ItemListColumnDefinitions,
    ItemListInternalState,
} from '/@/features/shared/components/item-list/utils/helpers';
import type { ServerItemType } from '@repo/shared-types/app-types';
import { ItemTableRow } from '../../item-table-row/item-table-row';
import { useAppDBItem } from '/@/api/app-db';

export interface InnerServerTableItemProps<T> {
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

export function InnerServerTableItem<T>(props: InnerServerTableItemProps<T>) {
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

    const { columns, displayType, itemSelection, itemType, onItemSelection, reducers } = context as {
        columns: ItemListColumnDefinitions;
        displayType: ItemCardProps<T>['type'];
        itemSelection: ItemListInternalState['itemSelection'];
        itemType: ServerItemType;
        onItemSelection: ItemListInternalState['_onMultiSelectionClick']
            | ItemListInternalState['_onSingleSelectionClick'];
        reducers: ItemListInternalState['reducers'];
    };

    const isSelected = Boolean(id ? itemSelection[id] : undefined);
    const isDragging = reducers.getIsDragging() && isSelected;

    const { data } = useAppDBItem(itemType as AppDBType, id);

    const handleClick = () => {
        if (id) {
            reducers._itemExpanded({ behavior: 'single', id, type: 'toggleById' });
            reducers.scrollToIndex({
                align: 'start',
                behavior: 'smooth',
                index,
            });
        }
    };

    return (
        <ItemTableRow
            columns={columns}
            data={data as T}
            id={id}
            index={index}
            isDragging={isDragging}
            isSelected={isSelected}
            reducers={reducers}
            type={displayType}
            onClick={handleClick}
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
