import type { AppDBType } from '/@/api/app-db';
import type { ItemCardProps } from '/@/features/shared/components/item-card/item-card';
import type {
    ItemListColumnDefinitions,
    ItemListInternalState,
} from '/@/features/shared/components/item-list/utils/helpers';
import type { ItemTableRowProps } from '/@/features/shared/components/item-table-row/item-table-row';
import type { ServerItemType } from '@repo/shared-types/app-types';
import { useAppDBItem } from '/@/api/app-db';
import { ItemTableRow } from '/@/features/shared/components/item-table-row/item-table-row';

export interface InnerServerTableItemProps<T> {
    context: unknown;
    data: string | undefined;
    index: number;
    onContextMenu?: ItemTableRowProps<T>['onContextMenu'];
    onDragInitialData?: ItemTableRowProps<T>['onDragInitialData'];
    onDragStart?: ItemTableRowProps<T>['onDragStart'];
    onDrop?: ItemTableRowProps<T>['onDrop'];
    onFavorite?: ItemTableRowProps<T>['onFavorite'];
    onPlay?: ItemTableRowProps<T>['onPlay'];
    onUnfavorite?: ItemTableRowProps<T>['onUnfavorite'];
    type?: ItemTableRowProps<T>['type'];
}

interface TableItemContext<T> {
    columns: ItemListColumnDefinitions;
    displayType: ItemCardProps<T>['type'];
    itemSelection: ItemListInternalState['itemSelection'];
    itemType: ServerItemType;
    onItemSelection: ItemListInternalState['_onMultiSelectionClick']
        | ItemListInternalState['_onSingleSelectionClick'];
    reducers: ItemListInternalState['reducers'];
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

    const {
        columns,
        displayType,
        itemSelection,
        itemType,
        onItemSelection,
        reducers,
    } = context as TableItemContext<T>;

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
            itemType={itemType}
            reducers={reducers}
            type={displayType as ItemTableRowProps<T>['type']}
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
