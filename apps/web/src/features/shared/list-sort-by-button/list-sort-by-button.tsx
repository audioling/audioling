import { Button } from '@/features/ui/button/button.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';
import { Text } from '@/features/ui/text/text.tsx';

interface ListSortByButtonProps<T> {
    onSortChanged: (sortBy: T) => void;
    options: { label: string; value: T }[];
    sort: T;
}

export function ListSortByButton<T>({ sort, onSortChanged, options }: ListSortByButtonProps<T>) {
    return (
        <Menu align="start" side="bottom">
            <Menu.Target>
                <Button leftIcon="sort" size="lg" variant="outline">
                    <Text>{options.find((option) => option.value === sort)?.label}</Text>
                </Button>
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
