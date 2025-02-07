import type { MouseEvent } from 'react';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';
import { EmptyCell } from '@/features/ui/item-list/item-table/columns/shared.tsx';

function Cell({ item, isHovered, handlers }: ItemListCellProps) {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        handlers?.onItemContextMenu?.(e);
    };

    if (!item || !isHovered) {
        return <EmptyCell />;
    }

    return (
        <IconButton
            isCompact
            icon="ellipsisHorizontal"
            variant="transparent"
            onClick={handleClick}
        />
    );
}

export const actionsColumn = {
    cell: Cell,
    header: () => '',
    id: 'actions' as ItemListColumn.ACTIONS,
    size: numberToColumnSize(30, 'px'),
};
