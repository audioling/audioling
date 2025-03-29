import type { ActionIconProps } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
import { Icon } from '/@/components/icon/icon';

interface RefreshButtonProps {
    buttonProps?: Partial<ActionIconProps>;
    loading?: boolean;
    onClick: () => void;
}

export function RefreshButton({ buttonProps, loading, onClick }: RefreshButtonProps) {
    return (
        <ActionIcon
            onClick={onClick}
            {...buttonProps}
        >
            <Icon animate={loading ? 'spin' : undefined} icon={loading ? 'spinner' : 'refresh'} />
        </ActionIcon>
    );
}
