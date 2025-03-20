import type { ItemListColumnDefinitions } from '/@/features/shared/components/item-list/utils/helpers';
import type { ItemTableRowProps } from '/@/features/shared/components/item-table-row/item-table-row';

export function DefaultItemTableRow<T>({
    columns,
    data,
    id,
    index,
    isDragging,
    isSelected,
    onContextMenu,
    onDragInitialData,
    onDragStart,
    onDrop,
    onFavorite,
    onItemSelection,
    onPlay,
    onUnfavorite,
    reducers,
}: ItemTableRowProps<T>) {
    if (!data) {
        return <DefaultItemTableRowSkeleton columns={columns} />;
    }

    return (
        <>
            {columns.map(column => (
                <column.cell key={column.id} index={index} isSelected={isSelected} item={data} />
            ))}
        </>
    );
}

interface DefaultItemTableRowProps<T> {
    columns: ItemListColumnDefinitions;
}

function DefaultItemTableRowSkeleton({ columns }: DefaultItemTableRowProps<any>) {
    return (
        <>
            {columns.map(column => (
                <div key={column.id}>Loading...</div>
            ))}
        </>
    );
}
