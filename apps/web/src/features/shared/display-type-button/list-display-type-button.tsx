import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import { ItemListDisplayType } from '@/features/ui/item-list/types.ts';

interface ListDisplayTypeButtonProps {
    displayType: ItemListDisplayType;
    onChangeDisplayType: (displayType: ItemListDisplayType) => void;
}

export function ListDisplayTypeButton({
    displayType,
    onChangeDisplayType,
}: ListDisplayTypeButtonProps) {
    if (displayType === ItemListDisplayType.TABLE) {
        return (
            <IconButtonWithTooltip
                icon="layoutGrid"
                size="lg"
                tooltipProps={{
                    label: 'Grid',
                    position: 'bottom',
                }}
                onClick={() => onChangeDisplayType(ItemListDisplayType.GRID)}
            />
        );
    }

    return (
        <IconButtonWithTooltip
            icon="layoutTable"
            size="lg"
            tooltipProps={{
                label: 'Table',
                position: 'bottom',
            }}
            onClick={() => onChangeDisplayType(ItemListDisplayType.TABLE)}
        />
    );
}
