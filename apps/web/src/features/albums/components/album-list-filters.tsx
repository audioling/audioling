import { Group } from '@mantine/core';
import { AlbumListSortOptionsLabels, ServerItemType } from '@repo/shared-types/app-types';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getAlbumListQueryKey } from '/@/features/albums/api/get-album-list';
import { getAlbumListCountQueryKey } from '/@/features/albums/api/get-album-list-count';
import { useAlbumListParams } from '/@/features/albums/hooks/use-album-list-options';
import { useAppContext, useAppFeatures } from '/@/features/authentication/context/app-context';
import { listDataQueryKey } from '/@/features/shared/components/item-list/hooks';
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

    return <RefreshButton loading={Boolean(isFetching)} onClick={handleRefreshClick} />;
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
            value={params.sortOrder}
            onChange={value => setParams({ sortOrder: value })}
        />
    );
}
