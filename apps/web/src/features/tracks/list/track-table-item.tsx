const InnerTrackTableItem = () => {
    // const {
    //     data,
    //     enableExpanded,
    //     index,
    //     itemType,
    //     onRowClick,
    //     onRowDoubleClick,
    //     onRowContextMenu,
    //     onRowDrop,
    //     onRowDrag,
    //     onRowDragData,
    //     rowIdProperty,
    //     enableRowDrag,
    //     tableId,
    // } = props;

    return null;

    // const ref = useRef<HTMLDivElement>(null);

    // const rowId = rowIdProperty
    //     ? (data[rowIdProperty as keyof TrackItem] as string)
    //     : index.toString();

    // const row = table.getRow(rowId);

    // const canSelect = row?.getCanSelect();
    // const isSelected = row?.getIsSelected();
    // const isExpanded = row?.getIsExpanded();

    // useEffect(() => {
    //     if (!ref.current) return;

    //     const fns = [];

    //     if (enableRowDrag) {
    //         fns.push(
    //             draggable({
    //                 element: ref.current,
    //                 getInitialData: () => {
    //                     const isSelfSelected = row.getIsSelected();

    //                     if (isSelfSelected) {
    //                         const selectedRows = table.getSelectedRowModel().rows;

    //                         const selectedRowIds = [];
    //                         const selectedItems = [];

    //                         for (const row of selectedRows) {
    //                             selectedRowIds.push(row.id);
    //                             selectedItems.push(row.original);
    //                         }

    //                         return dndUtils.generateDragData({
    //                             id: selectedRowIds,
    //                             item: selectedItems,
    //                             operation: [DragOperation.ADD],
    //                             type: DragTarget.TRACK,
    //                         });
    //                     }

    //                     return dndUtils.generateDragData({
    //                         id: [row.id],
    //                         item: [row.original],
    //                         operation: [DragOperation.ADD],
    //                         type: DragTarget.TRACK,
    //                     });
    //                 },
    //                 onDragStart: () => {
    //                     const isSelfSelected = row.getIsSelected();

    //                     // If attempting to drag a row that is not selected, select it
    //                     if (!isSelfSelected) {
    //                         table.resetRowSelection();
    //                         row.toggleSelected(true);
    //                     }
    //                 },
    //                 onDrop: () => {},
    //                 onGenerateDragPreview: (data) => {
    //                     disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
    //                     setCustomNativeDragPreview({
    //                         nativeSetDragImage: data.nativeSetDragImage,
    //                         render: ({ container }) => {
    //                             const root = createRoot(container);
    //                             const selectedCount = table.getSelectedRowModel().rows.length || 1;
    //                             root.render(<DragPreview itemCount={selectedCount} />);
    //                         },
    //                     });
    //                 },
    //             }),
    //         );
    //     }

    //     return combine(...fns);
    // }, [enableRowDrag, index, itemType, onRowDrag, onRowDragData, onRowDrop, row, row.id, table]);

    // if (enableExpanded && !isExpanded) {
    //     return null;
    // }

    // return (
    //     <div className={styles.rowContainer}>
    //         <div
    //             ref={ref}
    //             className={clsx(styles.row, {
    //                 [styles.canSelect]: canSelect,
    //                 [styles.selected]: isSelected,
    //             })}
    //             style={context.columnStyles?.styles}
    //             onClick={(e) => onRowClick?.(e, row, table)}
    //             onContextMenu={(e) =>
    //                 onRowContextMenu?.(
    //                     e,
    //                     row,
    //                     table,
    //                     table.getSelectedRowModel().rows.map((r) => r.original),
    //                 )
    //             }
    //             onDoubleClick={(e) => onRowDoubleClick?.(e, row, table)}
    //         >
    //             {row?.getVisibleCells()?.map((cell) => {
    //                 return (
    //                     <Fragment key={`${tableId}-cell-${cell.id}`}>
    //                         {flexRender(cell.column.columnDef.cell, {
    //                             ...cell.getContext(),
    //                             context: {
    //                                 currentTrack: context.currentTrack,
    //                                 libraryId: context.libraryId!,
    //                                 listKey: context.listKey,
    //                             },
    //                         })}
    //                     </Fragment>
    //                 );
    //             })}
    //         </div>
    //     </div>
    // );
};

export function TrackTableItem() {
    return <InnerTrackTableItem />;
}
