import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { ItemListCellProps, ItemListColumn } from '@/features/ui/item-list/helpers.ts';
import { numberToColumnSize } from '@/features/ui/item-list/helpers.ts';

function Cell({ item, isHovered }: ItemListCellProps) {
    if (!item || !isHovered) {
        return <>&nbsp;</>;
    }

    return (
        <IconButton
            isCompact
            icon="ellipsisHorizontal"
            variant="default"
            onClick={(e) => {
                e.stopPropagation();
            }}
        />
    );
}

export const actionsColumn = {
    cell: Cell,
    header: () => '',
    id: 'actions' as ItemListColumn.ACTIONS,
    size: numberToColumnSize(30, 'px'),
};
