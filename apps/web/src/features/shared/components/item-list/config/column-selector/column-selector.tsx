import { localize } from '@repo/localization';
import { ServerItemType } from '@repo/shared-types/app-types';
import clsx from 'clsx';
import { useMemo } from 'react';
import styles from './column-selector.module.css';
import { CheckboxSelect } from '/@/components/checkbox-select/checkbox-select';
import { ScrollArea } from '/@/components/scroll-area/scroll-area';
import { ItemListColumn } from '/@/features/shared/components/item-list/utils/helpers';

export const albumColumnOptions = [
    { label: localize.t('app.itemList.columns.rowIndex_option'), value: ItemListColumn.ROW_INDEX },
    { label: localize.t('app.itemList.columns.image_option'), value: ItemListColumn.IMAGE },
    { label: localize.t('app.itemList.columns.name_option'), value: ItemListColumn.NAME },
    { label: localize.t('app.itemList.columns.artists_option'), value: ItemListColumn.ARTISTS },
    { label: localize.t('app.itemList.columns.genre_option'), value: ItemListColumn.GENRE },
    { label: localize.t('app.itemList.columns.releaseDate_option'), value: ItemListColumn.RELEASE_DATE },
    { label: localize.t('app.itemList.columns.trackCount_option'), value: ItemListColumn.TRACK_COUNT },
    { label: localize.t('app.itemList.columns.year_option'), value: ItemListColumn.YEAR },
    { label: localize.t('app.itemList.columns.rating_option'), value: ItemListColumn.RATING },
    { label: localize.t('app.itemList.columns.favorite_option'), value: ItemListColumn.FAVORITE },
    { label: localize.t('app.itemList.columns.actions_option'), value: ItemListColumn.ACTIONS },
];

const columnOptions = {
    [ServerItemType.ALBUM]: albumColumnOptions,
};

interface ColumnSelectorProps {
    disabled?: boolean;
    itemType: ServerItemType;
    onChange: (columns: string[]) => void;
    value: string[];
}

export function ColumnSelector({
    disabled,
    itemType,
    onChange,
    value,
}: ColumnSelectorProps) {
    const columns = useMemo(() => {
        const selectedColumns = value.map(column => columnOptions[itemType as keyof typeof columnOptions]
            .find(c => c.value === column));

        const unselectedColumns = columnOptions[itemType as keyof typeof columnOptions]
            .filter(column => !value.includes(column.value));

        return [...selectedColumns, ...unselectedColumns].filter(Boolean) as { label: string; value: string }[];
    }, [itemType, value]);

    return (
        <ScrollArea
            allowDragScroll
            className={clsx(styles.scrollArea, { [styles.disabled]: disabled })}
        >
            <CheckboxSelect
                enableDrag
                data={columns}
                value={value}
                onChange={onChange}
            />
        </ScrollArea>
    );
}
