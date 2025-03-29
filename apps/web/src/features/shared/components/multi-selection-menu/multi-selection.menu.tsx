import type { ButtonProps } from '@mantine/core';
import { Button, Checkbox, Text } from '@mantine/core';
import { Icon } from '/@/components/icon/icon';
import { Menu } from '/@/components/menu/menu';

interface MultiSelectionMenuProps<T> {
    buttonProps?: Partial<ButtonProps>;
    onChange: (value: T) => void;
    options: { label: string; value: T }[];
    value: T[];
}

export function MultiSelectionMenu<T>({
    buttonProps,
    onChange,
    options,
    value,
}: MultiSelectionMenuProps<T>) {
    return (
        <Menu align="start" side="bottom">
            <Menu.Target>
                <Button
                    leftSection={<Icon icon="sort" />}
                    {...buttonProps}
                >
                    <Text>{options.find(option => option.value === value)?.label}</Text>
                </Button>
            </Menu.Target>
            <Menu.Content>
                {options.map(option => (
                    <Menu.Item
                        key={`sort-${option.value}`}
                        isSelected={value === option.value}
                        onSelect={() => onChange(option.value)}
                    >
                        <Checkbox
                            checked={value.includes(option.value)}
                            onChange={() => onChange(option.value)}
                        />
                        {option.label}
                    </Menu.Item>
                ))}
            </Menu.Content>
        </Menu>
    );
}
