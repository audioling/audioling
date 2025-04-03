import { ItemListDisplayType, ItemListPaginationType } from '/@/features/shared/components/item-list/types';
import { ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';
import { useListContext } from '/@/features/shared/context/list-context';
import { useListStoreOptions } from '/@/stores/list-store';

export function useListOptions() {
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
