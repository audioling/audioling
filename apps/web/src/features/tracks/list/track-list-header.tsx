import { ListHeader } from '@/features/shared/components/list-header.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton, IconButtonWithTooltip } from '@/features/ui/icon-button/icon-button.tsx';

export function TrackListHeader() {
    return (
        <ListHeader>
            <ListHeader.Left>
                <ListHeader.Title>Tracks</ListHeader.Title>
            </ListHeader.Left>
            <ListHeader.Right>
                <Group gap="xs">
                    <IconButton icon="search" size="lg" />
                </Group>
            </ListHeader.Right>
            <ListHeader.Footer>
                <ListHeader.Left>
                    <Group gap="xs" wrap="nowrap">
                        <IconButtonWithTooltip
                            icon="sort"
                            size="lg"
                            tooltipProps={{ label: 'Sort by', position: 'bottom' }}
                        />
                        <IconButtonWithTooltip
                            icon="sortAsc"
                            size="lg"
                            tooltipProps={{ label: 'Sort order', position: 'bottom' }}
                        />
                        <IconButtonWithTooltip
                            icon="refresh"
                            size="lg"
                            tooltipProps={{ label: 'Refresh', position: 'bottom' }}
                        />
                    </Group>
                </ListHeader.Left>
                <ListHeader.Right>
                    <Group gap="xs" wrap="nowrap">
                        <IconButtonWithTooltip
                            icon="layoutGrid"
                            size="lg"
                            tooltipProps={{ label: 'Grid', position: 'bottom' }}
                        />
                        <IconButtonWithTooltip
                            icon="listInfinite"
                            size="lg"
                            tooltipProps={{ label: 'Infinite', position: 'bottom' }}
                        />
                    </Group>
                </ListHeader.Right>
            </ListHeader.Footer>
        </ListHeader>
    );
}
