import type { IconButtonProps } from '@/features/ui/icon-button/icon-button.tsx';
import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import { ItemListPaginationType } from '@/features/ui/item-list/types.ts';

interface ListPaginationTypeButtonProps {
    buttonProps?: Partial<IconButtonProps>;
    onChangePaginationType: (paginationType: ItemListPaginationType) => void;
    paginationType: ItemListPaginationType;
}

export function ListPaginationTypeButton({
    buttonProps,
    paginationType,
    onChangePaginationType,
}: ListPaginationTypeButtonProps) {
    if (paginationType === ItemListPaginationType.INFINITE) {
        return (
            <IconButtonWithTooltip
                isCompact
                icon="listPaginated"
                size="lg"
                tooltipProps={{ label: 'Paginated', position: 'top' }}
                onClick={() => onChangePaginationType(ItemListPaginationType.PAGINATED)}
                {...buttonProps}
            />
        );
    }

    return (
        <IconButtonWithTooltip
            isCompact
            icon="listInfinite"
            size="lg"
            tooltipProps={{ label: 'Infinite', position: 'top' }}
            onClick={() => onChangePaginationType(ItemListPaginationType.INFINITE)}
            {...buttonProps}
        />
    );
}
