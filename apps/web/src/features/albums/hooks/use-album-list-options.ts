import type { AdapterAlbumListQuery } from '@repo/shared-types/adapter-types';
import { localize } from '@repo/localization';
import { AlbumListSortOptions, ListSortOrder } from '@repo/shared-types/app-types';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useListContext } from '../../shared/context/list-context';
import { ItemListDisplayType, ItemListPaginationType } from '/@/features/shared/components/item-list/types';
import { ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { useListStoreOptions, useListStoreParams } from '/@/stores/list-store';

export function useAlbumListOptions() {
    const { key } = useListContext();

    const options = useListStoreOptions(key, {
        columnOrder: [
            ItemListColumn.ROW_INDEX,
            ItemListColumn.NAME,
            ItemListColumn.ALBUM_ARTISTS,
        ],
        displayType: ItemListDisplayType.GRID,
        initialScrollIndex: 0,
        pagination: {
            currentPage: 1,
            itemsPerPage: 100,
        },
        paginationType: ItemListPaginationType.INFINITE,
    });

    return {
        ...options,
        key,
    };
}

export function useAlbumListParams() {
    const { key } = useListContext();

    const [searchParams] = useSearchParams();

    const overrides = useMemo(() => {
        const params = {
            searchTerm: searchParams.get('searchTerm') || undefined,
            sortBy: (searchParams.get('sortBy') || undefined) as AlbumListSortOptions | undefined,
            sortOrder: (searchParams.get('sortOrder') || undefined) as ListSortOrder | undefined,
        };

        return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
    }, [searchParams]);

    const { params, setParams: setListStoreParams } = useListStoreParams<
        Omit<AdapterAlbumListQuery, 'limit' | 'offset'>
    >(key, {
        defaults: {
            sortBy: AlbumListSortOptions.NAME,
            sortOrder: ListSortOrder.ASC,
        },
        overrides,
    });

    const componentKey = useMemo(() => {
        return JSON.stringify(params);
    }, [params]);

    const setParams = useCallback((params: Record<string, unknown>) => {
        setListStoreParams(key, params);
    }, [key, setListStoreParams]);

    return {
        componentKey,
        params,
        setParams,
    };
}

export const albumColumnOptions = [
    { label: localize.t('app.albums.columns.rowIndex_option'), value: ItemListColumn.ROW_INDEX },
    { label: localize.t('app.albums.columns.image_option'), value: ItemListColumn.IMAGE },
    { label: localize.t('app.albums.columns.name_option'), value: ItemListColumn.NAME },
    { label: localize.t('app.albums.columns.artists_option'), value: ItemListColumn.ARTISTS },
    { label: localize.t('app.albums.columns.genre_option'), value: ItemListColumn.GENRE },
    { label: localize.t('app.albums.columns.releaseDate_option'), value: ItemListColumn.RELEASE_DATE },
    { label: localize.t('app.albums.columns.trackCount_option'), value: ItemListColumn.TRACK_COUNT },
    { label: localize.t('app.albums.columns.year_option'), value: ItemListColumn.YEAR },
    { label: localize.t('app.albums.columns.rating_option'), value: ItemListColumn.RATING },
    { label: localize.t('app.albums.columns.favorite_option'), value: ItemListColumn.FAVORITE },
    { label: localize.t('app.albums.columns.actions_option'), value: ItemListColumn.ACTIONS },
];
