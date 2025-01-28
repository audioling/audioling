import type { ColumnHelper } from '@tanstack/react-table';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { itemListHelpers } from '@/features/ui/item-list/helpers.ts';

export function actionsColumn<T>(columnHelper: ColumnHelper<T>) {
    return columnHelper.display({
        cell: ({ row, context }) => {
            const item = context.data || row.original;

            if (!item || !context.isHovered) {
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
        },
        header: '',
        id: 'actions',
        size: itemListHelpers.table.numberToColumnSize(30, 'px'),
    });
}
