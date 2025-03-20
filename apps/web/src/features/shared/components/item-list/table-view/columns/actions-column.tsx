import type { MouseEvent } from 'react';
import { ActionIcon } from '@mantine/core';
import { Icon } from '/@/components/icon/icon';
import { EmptyCell } from '/@/features/shared/components/item-list/table-view/columns/shared';
import {
    type ItemListCellProps,
    type ItemListColumn,
    numberToColumnSize,
} from '/@/features/shared/components/item-list/utils/helpers';

function Cell({ handlers, isHovered, item }: ItemListCellProps) {
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        handlers?.onItemContextMenu?.(e);
    };

    if (!item || !isHovered) {
        return <EmptyCell />;
    }

    return (
        <ActionIcon
            variant="transparent"
            onClick={handleClick}
        >
            <Icon icon="ellipsisHorizontal" />
        </ActionIcon>
    );
}

export const actionsColumn = {
    cell: Cell,
    header: () => '',
    id: 'actions' as ItemListColumn.ACTIONS,
    size: numberToColumnSize(30, 'px'),
};
