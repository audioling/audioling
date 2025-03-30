import { ActionIcon, Group, Popover, Stack } from '@mantine/core';
import { AlbumListSortOptionsLabels, ServerItemType } from '@repo/shared-types/app-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Icon } from '/@/components/icon/icon';
import { getAlbumListQueryKey } from '/@/features/albums/api/get-album-list';
import { getAlbumListCountQueryKey } from '/@/features/albums/api/get-album-list-count';
import {
    useAlbumListOptions,
    useAlbumListParams,
} from '/@/features/albums/hooks/use-album-list-options';
import { useAppContext, useAppFeatures } from '/@/features/authentication/context/app-context';
import { DisplayTypeSelector } from '/@/features/shared/components/display-type-selector/display-type-selector';
import { listDataQueryKey } from '/@/features/shared/components/item-list/utils/hooks';
import {
    PaginationTypeSelector,
} from '/@/features/shared/components/pagination-type-selector.tsx/pagination-type-selector';
import { RefreshButton } from '/@/features/shared/components/refresh-button/refresh-button';
import { SelectionMenu } from '/@/features/shared/components/selection-menu/selection-menu';
import { SortOrderToggle } from '/@/features/shared/components/sort-order-toggle/sort-order-toggle';

export function AlbumListFilters() {
    return (
        <Group gap="xs">
            <AlbumListSortMenu />
            <AlbumListSortOrderToggle />
            <AlbumListRefreshButton />
        </Group>
    );
}

function AlbumListRefreshButton() {
    const { server } = useAppContext();
    const queryClient = useQueryClient();

    const isFetching = useIsFetching({ exact: false, queryKey: getAlbumListQueryKey(server) });

    const handleRefreshClick = () => {
        queryClient.resetQueries({ queryKey: getAlbumListCountQueryKey(server) });
        queryClient.invalidateQueries({ queryKey: getAlbumListQueryKey(server) });
        queryClient.invalidateQueries({ queryKey: listDataQueryKey(server, ServerItemType.ALBUM) });
    };

    return (
        <RefreshButton
            buttonProps={{ variant: 'outline' }}
            loading={Boolean(isFetching)}
            onClick={handleRefreshClick}
        />
    );
}

function AlbumListSortMenu() {
    const features = useAppFeatures();
    const { params, setParams } = useAlbumListParams();

    const sortOptions = useMemo(() => {
        return features['album:list:sort'].map(option => ({
            label: AlbumListSortOptionsLabels[option],
            value: option,
        }));
    }, [features]);

    return (
        <SelectionMenu
            buttonProps={{ variant: 'outline' }}
            options={sortOptions}
            value={params.sortBy}
            onChange={value => setParams({ sortBy: value })}
        />
    );
}

function AlbumListSortOrderToggle() {
    const { params, setParams } = useAlbumListParams();

    return (
        <SortOrderToggle
            buttonProps={{ variant: 'outline' }}
            value={params.sortOrder}
            onChange={value => setParams({ sortOrder: value })}
        />
    );
}

export function AlbumListConfigMenu() {
    const {
        displayType,
        key,
        paginationType,
        setDisplayType,
        setPaginationType,
    } = useAlbumListOptions();

    return (
        <Popover position="bottom-end">
            <Popover.Target>
                <ActionIcon size="xs" variant="subtle">
                    <Icon icon="settings" />
                </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown>
                <Stack gap="xs">
                    <div style={{ display: 'grid', gridTemplateColumns: '100px minmax(0, 1fr)' }}>
                        <label style={{ alignItems: 'center', display: 'flex' }}>Display</label>
                        <DisplayTypeSelector
                            value={displayType}
                            onChange={value => setDisplayType(key, value)}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px minmax(0, 1fr)' }}>
                        <label style={{ alignItems: 'center', display: 'flex' }}>Pagination</label>
                        <PaginationTypeSelector
                            value={paginationType}
                            onChange={value => setPaginationType(key, value)}
                        />
                    </div>
                    {/* <MultiSelectionMenu
                        options={albumColumnOptions}
                        // value={params.columnOrder}
                        // onChange={value => setParams({ columnOrder: value })}
                    /> */}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );

    // return (

    //     <Menu align="end">
    //         <Menu.Target>
    //             <ActionIcon size="xs" variant="subtle">
    //                 <Icon icon="settings" />
    //             </ActionIcon>
    //         </Menu.Target>
    //         <Menu.Content>
    //             <Menu.Item>Hello</Menu.Item>
    //         </Menu.Content>
    //     </Menu>
    // );
}
