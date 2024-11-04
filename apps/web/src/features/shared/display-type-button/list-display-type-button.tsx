import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import { ItemListDisplayType } from '@/features/ui/item-list/types.ts';

interface ListDisplayTypeButtonProps {
    displayType: ItemListDisplayType;
    setDisplayType: (displayType: ItemListDisplayType) => void;
}

export function ListDisplayTypeButton({ displayType, setDisplayType }: ListDisplayTypeButtonProps) {
    return (
        <IconButtonWithTooltip
            icon={displayType === ItemListDisplayType.GRID ? 'layoutGrid' : 'layoutList'}
            size="lg"
            tooltipProps={{ label: 'Grid', position: 'bottom' }}
            onClick={() =>
                setDisplayType(
                    displayType === ItemListDisplayType.GRID
                        ? ItemListDisplayType.LIST
                        : ItemListDisplayType.GRID,
                )
            }
        />
    );
}
