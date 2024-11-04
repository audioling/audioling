import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';

interface ListSortByButtonProps<T> {
    onSortChanged: (sortBy: T) => void;
    options: { label: string; value: T }[];
    sort: T;
}

export function ListSortByButton<T>({ sort, onSortChanged, options }: ListSortByButtonProps<T>) {
    return (
        <Menu align="start" side="bottom">
            <Menu.Target>
                <IconButtonWithTooltip
                    icon="sort"
                    size="lg"
                    tooltipProps={{ label: 'Sort by', position: 'bottom' }}
                />
            </Menu.Target>
            <Menu.Content>
                {options.map((option) => (
                    <Menu.Item
                        key={`sort-${option.value}`}
                        isSelected={sort === option.value}
                        onSelect={() => onSortChanged(option.value)}
                    >
                        {option.label}
                    </Menu.Item>
                ))}
            </Menu.Content>
        </Menu>
    );
}
