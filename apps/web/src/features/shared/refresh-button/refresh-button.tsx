import { IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';

interface RefreshButtonProps {
    isDisabled?: boolean;
    isLoading?: boolean;
    onRefresh: () => void;
}

export function RefreshButton({ isDisabled, isLoading, onRefresh }: RefreshButtonProps) {
    return (
        <IconButtonWithTooltip
            disabled={isDisabled}
            icon="refresh"
            isLoading={isLoading}
            size="lg"
            tooltipProps={{ label: 'Refresh', position: 'bottom' }}
            variant="outline"
            onClick={onRefresh}
        />
    );
}
