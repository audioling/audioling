import type { ActionIconProps } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { ListSortOrder } from '@repo/shared-types/app-types';
import { Icon } from '/@/components/icon/icon';

interface SortOrderToggleProps {
    buttonProps?: Partial<ActionIconProps>;
    onChange: (value: ListSortOrder) => void;
    value: ListSortOrder;
}

export function SortOrderToggle({ buttonProps, onChange, value }: SortOrderToggleProps) {
    return (
        <ActionIcon
            onClick={() => onChange(value === ListSortOrder.ASC ? ListSortOrder.DESC : ListSortOrder.ASC)}
            {...buttonProps}
        >
            <Icon icon={value === ListSortOrder.ASC ? 'sortAsc' : 'sortDesc'} />
        </ActionIcon>
    );
}
