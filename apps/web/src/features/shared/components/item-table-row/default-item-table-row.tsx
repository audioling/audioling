import type { ItemTableRowProps } from '/@/features/shared/components/item-table-row/item-table-row';

export function DefaultItemTableRow<T>({
    columns,
    data,
    id,
    index,
    isDragging,
    isSelected,
    onClick,
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
    // const isExpanded = id ? reducers?.getExpandedById(id) : false;

    // const handleClick = () => {
    //     if (id) {
    //         reducers?._itemExpanded({ id, type: 'toggleById' });
    //         reducers?.scrollToIndex({
    //             behavior: 'smooth',
    //             index,
    //         });
    //     }
    // };

    return (
        <>
            {columns.map(column => (
                <column.cell
                    key={column.id}
                    id={id}
                    index={index}
                    isSelected={isSelected}
                    item={data}
                    reducers={reducers}
                    onClick={onClick}
                />
            ))}
        </>
    );
}
