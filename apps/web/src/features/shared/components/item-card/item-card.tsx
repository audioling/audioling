import type { ItemListInternalState } from '/@/features/shared/components/item-list/utils/helpers';
import type { PlayType } from '/@/stores/player-store';
import type { DragData } from '/@/utils/drag-drop';
import type { MouseEvent } from 'react';
import { DefaultItemCard, DefaultItemCardSkeleton } from '/@/features/shared/components/item-card/default-item-card';

interface Item {
    id: string;
    serverId: string;
}

export interface ItemCardProps<T> {
    data: T | undefined;
    id: string | undefined;
    index: number;
    isDragging?: boolean;
    isSelected?: boolean;
    lines?: {
        path?: string;
        property: string;
        transform?: (data: T) => string;
    }[];
    onClick?: (
        item: Item,
        event: MouseEvent<HTMLDivElement | HTMLButtonElement>,
        reducers?: ItemListInternalState['reducers'],
    ) => void;
    onContextMenu?: (
        item: Item,
        event: MouseEvent<HTMLDivElement | HTMLButtonElement>,
        reducers?: ItemListInternalState['reducers'],
    ) => void;
    onDragInitialData?: (item: Item, reducers?: ItemListInternalState['reducers']) => DragData;
    onDragStart?: (item: Item, reducers?: ItemListInternalState['reducers']) => void;
    onDrop?: (item: Item, reducers?: ItemListInternalState['reducers']) => void;
    onFavorite?: (item: Item) => void;
    onItemSelection?: (
        item: Item,
        index: number,
        event: MouseEvent<HTMLDivElement | HTMLButtonElement>
    ) => void;
    onPlay?: (item: Item, playType: PlayType) => void;
    onUnfavorite?: (item: Item) => void;
    reducers?: ItemListInternalState['reducers'];
    type?: 'default' | 'default-skeleton';
}

export function ItemCard<T>(props: ItemCardProps<T>) {
    const { type = 'default', ...rest } = props;

    switch (type) {
        case 'default':
            return <DefaultItemCard {...rest} />;
        case 'default-skeleton':
            return <DefaultItemCardSkeleton lines={rest.lines || []} />;
        default:
            return <DefaultItemCard {...rest} />;
    }
}
