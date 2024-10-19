import type { MouseEvent } from 'react';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Row } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import styles from './entity-table-row.module.scss';

interface EntityTableRowProps<T> extends React.ComponentPropsWithoutRef<'div'> {
    handleRowSelection?: (e: MouseEvent<HTMLDivElement>, row: Row<T>) => void;
    lastSelectedRowId?: string;
    row: Row<T>;
    rowStyle: React.CSSProperties;
}

export const EntityTableRow = <T extends { id: string }>(props: EntityTableRowProps<T>) => {
    const { handleRowSelection, row, rowStyle, style } = props;

    const isSelected = row.getIsSelected();
    const isSelectable = row.getCanSelect();

    const classNames = clsx({
        [styles.listRow]: true,
        [styles.selected]: isSelected,
    });

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (!isSelectable) return;

        handleRowSelection?.(e, row);
    };

    return (
        <div
            className={classNames}
            style={{
                ...style,
                ...rowStyle,
                width: '100%',
            }}
            onClick={handleClick}
        >
            {row.getVisibleCells().map((cell) => (
                <div key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
            ))}
        </div>
    );
};

export const DraggableEntityTableRow = <T extends { id: string }>(
    props: EntityTableRowProps<T>,
) => {
    const { handleRowSelection, row, rowStyle, style } = props;

    const isSelected = row.getIsSelected();
    const isSelectable = row.getCanSelect();

    const classNames = clsx({
        [styles.listRow]: true,
        [styles.selected]: isSelected,
    });

    const { transform, transition, setNodeRef, isDragging, attributes, listeners, isSorting } =
        useSortable({
            id: row.original.id,
        });

    const dndStyle: React.CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        transform: isSorting ? undefined : CSS.Translate.toString(transform),
        transition: transition,
        zIndex: isDragging ? 1 : 0,
    };

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (!isSelectable) return;

        handleRowSelection?.(e, row);
    };

    return (
        <div className={classNames} style={style} onClick={handleClick}>
            <div
                ref={setNodeRef}
                style={{ ...rowStyle, ...dndStyle, height: '100%' }}
                {...attributes}
                {...listeners}
            >
                {row.getVisibleCells().map((cell) => (
                    <div
                        key={cell.id}
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                            width: cell.column.getSize(),
                        }}
                    >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                ))}
            </div>
        </div>
    );
};
