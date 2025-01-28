import type { IconButtonProps } from '@/features/ui/icon-button/icon-button.tsx';
import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import { ItemListDisplayType } from '@/features/ui/item-list/types.ts';

interface ListDisplayTypeButtonProps {
    buttonProps?: Partial<IconButtonProps>;
    displayType: ItemListDisplayType;
    onChangeDisplayType: (displayType: ItemListDisplayType) => void;
}

export function ListDisplayTypeButton({
    buttonProps,
    displayType,
    onChangeDisplayType,
}: ListDisplayTypeButtonProps) {
    if (displayType === ItemListDisplayType.TABLE) {
        return (
            <IconButtonWithTooltip
                isCompact
                icon="layoutGrid"
                size="lg"
                tooltipProps={{
                    label: 'Grid',
                    position: 'top',
                }}
                onClick={() => onChangeDisplayType(ItemListDisplayType.GRID)}
                {...buttonProps}
            />
        );
    }

    return (
        <IconButtonWithTooltip
            isCompact
            icon="layoutTable"
            size="lg"
            tooltipProps={{
                label: 'Table',
                position: 'top',
            }}
            onClick={() => onChangeDisplayType(ItemListDisplayType.TABLE)}
            {...buttonProps}
        />
    );
}
