import { ListDisplayTypeButton } from '@/features/shared/display-type-button/list-display-type-button.tsx';
import { ListPaginationTypeButton } from '@/features/shared/list-pagination-type-button/list-pagination-type-button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import type { IconButtonProps } from '@/features/ui/icon-button/icon-button.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { ItemListColumn, ItemListColumnOrder } from '@/features/ui/item-list/helpers.ts';
import { ItemListDisplayType, type ItemListPaginationType } from '@/features/ui/item-list/types.ts';
import type { MenuProps } from '@/features/ui/menu/menu.tsx';
import { Menu } from '@/features/ui/menu/menu.tsx';

interface ListOptionsButtonProps {
    buttonProps?: Partial<IconButtonProps>;
    columnOptions: { label: string; value: ItemListColumn }[];
    columns: ItemListColumn[];
    displayType?: ItemListDisplayType;
    menuProps?: Partial<MenuProps>;
    onChangeColumns: (columns: ItemListColumnOrder) => void;
    onChangeDisplayType?: (displayType: ItemListDisplayType) => void;
    onChangePaginationType: (paginationType: ItemListPaginationType) => void;
    paginationType: ItemListPaginationType;
}

export function ListOptionsButton({
    buttonProps,
    columns,
    columnOptions,
    displayType,
    menuProps,
    onChangeDisplayType,
    onChangePaginationType,
    onChangeColumns,
    paginationType,
}: ListOptionsButtonProps) {
    const handleChangeColumns = (column: ItemListColumn) => {
        const uniqueColumns = [...new Set([...columns, column])];

        if (columns.includes(column)) {
            onChangeColumns(uniqueColumns.filter((c) => c !== column));
        } else {
            onChangeColumns(uniqueColumns);
        }
    };

    return (
        <Menu align="end" closeOnSelect={false} side="bottom" {...menuProps}>
            <Menu.Target>
                <IconButton isCompact icon="ellipsisHorizontal" size="lg" {...buttonProps} />
            </Menu.Target>
            <Menu.Content
                stickyContent={
                    <Group grow gap="xs" h="100%">
                        <ListPaginationTypeButton
                            paginationType={paginationType}
                            onChangePaginationType={onChangePaginationType}
                        />
                        <ListDisplayTypeButton
                            buttonProps={{
                                isDisabled: !onChangeDisplayType,
                            }}
                            displayType={displayType ?? ItemListDisplayType.TABLE}
                            onChangeDisplayType={onChangeDisplayType ?? (() => {})}
                        />
                    </Group>
                }
            >
                <Menu.Divider />
                {columnOptions.map((option) => (
                    <Menu.Item
                        key={`sort-${option.value}`}
                        isSelected={columns.includes(option.value)}
                        onSelect={() => handleChangeColumns(option.value)}
                    >
                        {option.label}
                    </Menu.Item>
                ))}
            </Menu.Content>
        </Menu>
    );
}
