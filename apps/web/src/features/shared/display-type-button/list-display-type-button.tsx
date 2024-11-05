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
    return (
        <IconButtonWithTooltip
            icon={displayType === ItemListDisplayType.GRID ? 'layoutGrid' : 'layoutList'}
            size="lg"
            tooltipProps={{
                label: displayType === ItemListDisplayType.GRID ? 'Grid' : 'List',
                position: 'bottom',
            }}
            onClick={() =>
                onChangeDisplayType(
                    displayType === ItemListDisplayType.GRID
                        ? ItemListDisplayType.LIST
                        : ItemListDisplayType.GRID,
                )
            }
        />
    );
}
