import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import { ItemListPaginationType } from '@/features/ui/item-list/types.ts';

interface ListPaginationTypeButtonProps {
    onChangePaginationType: (paginationType: ItemListPaginationType) => void;
    paginationType: ItemListPaginationType;
}

export function ListPaginationTypeButton({
    paginationType,
    onChangePaginationType,
}: ListPaginationTypeButtonProps) {
    if (paginationType === ItemListPaginationType.INFINITE) {
        return (
            <IconButtonWithTooltip
                isCompact
                icon="listPaginated"
                size="lg"
                tooltipProps={{ label: 'Paginated', position: 'bottom' }}
                onClick={() => onChangePaginationType(ItemListPaginationType.PAGINATED)}
            />
        );
    }

    return (
        <IconButtonWithTooltip
            isCompact
            icon="listInfinite"
            size="lg"
            tooltipProps={{ label: 'Infinite', position: 'bottom' }}
            onClick={() => onChangePaginationType(ItemListPaginationType.INFINITE)}
        />
    );
}
