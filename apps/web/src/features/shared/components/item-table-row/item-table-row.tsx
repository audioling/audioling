import type {
    ItemListColumnDefinitions,
    ItemListInternalState,
} from '/@/features/shared/components/item-list/utils/helpers';
import type { PlayType } from '/@/stores/player-store';
import type { DragData } from '/@/utils/drag-drop';
import type { MouseEvent } from 'react';
import { DefaultItemTableRow } from '/@/features/shared/components/item-table-row/default-item-table-row';

interface Item {
    id: string;
    serverId: string;
}

export interface ItemTableRowProps<T> {
    columns: ItemListColumnDefinitions;
    data: T | undefined;
    id: string | undefined;
    index: number;
    isDragging?: boolean;
    isSelected?: boolean;
    onClick?: (item: Item) => void;
    onContextMenu?: (
        item: Item,
        event: MouseEvent<HTMLButtonElement>,
        reducers?: ItemListInternalState['reducers'],
    ) => void;
    onDragInitialData?: (item: Item, reducers?: ItemListInternalState['reducers']) => DragData;
    onDragStart?: (item: Item, reducers?: ItemListInternalState['reducers']) => void;
    onDrop?: (item: Item, reducers?: ItemListInternalState['reducers']) => void;
    onFavorite?: (item: Item) => void;
    onItemSelection?: (
        item: Item,
        index: number,
        event: MouseEvent<HTMLButtonElement>
    ) => void;
    onPlay?: (item: Item, playType: PlayType) => void;
    onUnfavorite?: (item: Item) => void;
    reducers?: ItemListInternalState['reducers'];
    type?: 'default' | 'default-skeleton';
}

export function ItemTableRow<T>(props: ItemTableRowProps<T>) {
    const { type = 'default', ...rest } = props;

    switch (type) {
        case 'default':
            return <DefaultItemTableRow {...rest} />;
        case 'default-skeleton':
            return <DefaultItemTableRow {...rest} />;
        default:
            return <DefaultItemTableRow {...rest} />;
    }
}
