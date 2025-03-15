import type { PlayType } from '/@/stores/player-store';
import type { DragData } from '/@/utils/drag-drop';
import type { MouseEvent } from 'react';
import { DefaultItemCard, DefaultItemCardSkeleton } from '/@/features/shared/components/item-card/default-item-card';

export interface ItemCardProps<T> {
    data: T | undefined;
    id: string | undefined;
    index: number;
    isSelected?: boolean;
    lines?: {
        path?: string;
        property: string;
        transform?: (data: T) => string;
    }[];
    onContextMenu?: (id: string, serverId: string, event: MouseEvent<HTMLButtonElement>) => void;
    onDragInitialData?: (id: string) => DragData;
    onDragStart?: (id: string) => void;
    onDrop?: (id: string) => void;
    onFavorite?: (id: string, serverId: string) => void;
    onItemSelection?: (id: string, index: number, e: MouseEvent<HTMLButtonElement>) => void;
    onPlay?: (id: string, serverId: string, playType: PlayType) => void;
    onUnfavorite?: (id: string, serverId: string) => void;
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
