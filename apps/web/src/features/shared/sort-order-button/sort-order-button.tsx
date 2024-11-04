import { ListSortOrder } from '@repo/shared-types';
import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';

interface SortOrderButtonProps {
    onOrderChanged: (order: ListSortOrder) => void;
    order: ListSortOrder;
}

export function SortOrderButton({ order, onOrderChanged }: SortOrderButtonProps) {
    return (
        <IconButtonWithTooltip
            icon={order === ListSortOrder.ASC ? 'sortAsc' : 'sortDesc'}
            size="lg"
            tooltipProps={{
                label: order === ListSortOrder.ASC ? 'Ascending' : 'Descending',
                position: 'bottom',
            }}
            onClick={() =>
                onOrderChanged(order === ListSortOrder.ASC ? ListSortOrder.DESC : ListSortOrder.ASC)
            }
        />
    );
}
