import type { ItemListColumnOrder } from '/@/features/shared/components/item-list/utils/helpers';
import type { ServerItemType } from '@repo/shared-types/app-types';
import { ActionIcon, Popover, Stack } from '@mantine/core';
import { Icon } from '/@/components/icon/icon';
import { ColumnSelector } from '/@/features/shared/components/item-list/config/column-selector/column-selector';
import {
    DisplayTypeSelector,
} from '/@/features/shared/components/item-list/config/display-type-selector/display-type-selector';
import {
    PaginationSizeInput,
} from '/@/features/shared/components/item-list/config/page-size-input/pagination-size-input';
import {
    PaginationTypeSelector,
} from '/@/features/shared/components/item-list/config/pagination-type-selector/pagination-type-selector';
import { useListOptions } from '/@/features/shared/components/item-list/config/use-list-options';

interface ItemListConfigProps {
    itemType: ServerItemType;
}

export function ItemListConfig({ itemType }: ItemListConfigProps) {
    const {
        columnOrder,
        displayType,
        key,
        pagination,
        paginationType,
        setColumnOrder,
        setDisplayType,
        setPagination,
        setPaginationType,
    } = useListOptions();

    return (
        <Popover position="bottom-end">
            <Popover.Target>
                <ActionIcon size="xs" variant="subtle">
                    <Icon icon="settings" />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown maw="300px" miw="200px">
                <Stack>
                    <DisplayTypeSelector
                        value={displayType}
                        onChange={value => setDisplayType(key, value)}
                    />
                    <PaginationTypeSelector
                        value={paginationType}
                        onChange={value => setPaginationType(key, value)}
                    />
                    <PaginationSizeInput
                        value={pagination.itemsPerPage}
                        onChange={value => setPagination(key, { ...pagination, itemsPerPage: value })}
                    />
                    <ColumnSelector
                        itemType={itemType}
                        value={columnOrder}
                        onChange={(value) => {
                            setColumnOrder(key, value as ItemListColumnOrder);
                        }}
                    />
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
