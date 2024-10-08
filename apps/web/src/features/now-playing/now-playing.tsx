import React, { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { EntityTableVirtual } from '@/features/ui/entity-table/entity-table-virtual.tsx';
import { useEntityTable } from '@/features/ui/entity-table/hooks/use-entity.table.ts';
import type { Person } from '@/features/ui/entity-table/make-data.ts';
import { makeData } from '@/features/ui/entity-table/make-data.ts';
import { Group } from '@/features/ui/group/group.tsx';

export function ListExample() {
    const [rows, setRows] = useState(makeData(100));

    const columns = React.useMemo<ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                size: 60,
            },
            {
                accessorKey: 'firstName',
                cell: (info) => info.getValue(),
            },
            {
                accessorFn: (row) => row.lastName,
                cell: (info) => info.getValue(),
                header: () => <span>Last Name</span>,
                id: 'lastName',
            },
            {
                accessorKey: 'age',
                header: () => 'Age',
                size: 50,
            },
            {
                accessorKey: 'visits',
                header: () => <span>Visits</span>,
                size: 50,
            },
            {
                accessorKey: 'status',
                header: 'Status',
            },
            {
                accessorKey: 'progress',
                header: 'Progress',
                size: 80,
            },
        ],
        [],
    );

    const tableProps = useEntityTable({
        columns,
        data: {
            rows,
            setRows,
        },
        options: {
            isMultiRowSelection: true,
        },
        tableId: 'list-example',
    });

    return (
        <Group>
            <EntityTableVirtual {...tableProps} />
        </Group>
    );
}

// function Example() {
//     const [items, setItems] = useState(makeData(50));

//     return (
//         <SortableList
//             items={items}
//             renderItem={(item, activeIndex) => (
//                 <SortableList.Item
//                     activeIndex={activeIndex}
//                     entityId={item.id}
//                 >
//                     {item.id}
//                     <SortableList.DragHandle />
//                 </SortableList.Item>
//             )}
//             onChange={setItems}
//         />
//     );
// }

// function Virtualizer() {
//     const parentRef = React.useRef(null);

//     const rowVirtualizer = useVirtualizer({
//         count: 10000,
//         estimateSize: () => 35,
//         getScrollElement: () => parentRef.current,
//         overscan: 5,
//     });

//     return (
//         <>
//             <div
//                 ref={parentRef}
//                 className="List"
//                 style={{
//                     height: `200px`,
//                     overflow: 'auto',
//                     width: `400px`,
//                 }}
//             >
//                 <div
//                     style={{
//                         height: `${rowVirtualizer.getTotalSize()}px`,
//                         position: 'relative',
//                         width: '100%',
//                     }}
//                 >
//                     {rowVirtualizer.getVirtualItems().map((virtualRow) => (
//                         <div
//                             key={virtualRow.index}
//                             className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
//                             style={{
//                                 height: `${virtualRow.size}px`,
//                                 left: 0,
//                                 position: 'absolute',
//                                 top: 0,
//                                 transform: `translateY(${virtualRow.start}px)`,
//                                 width: '100%',
//                             }}
//                         >
//                             Row {virtualRow.index}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// }

// function FramerExample() {
//     const controls = useDragControls();
//     const setDragControls = useSetDragControls();

//     useEffect(() => {
//         setDragControls(controls);
//     }, [controls, setDragControls]);

//     return (
//         <div>
//             {/* <FramerDraggable id="1" /> */}
//             {/* <DragItemOverlay /> */}
//         </div>
//     );
// }
