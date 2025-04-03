import type { DragData } from '/@/utils/drag-drop';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
    attachClosestEdge,
    extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
    draggable,
    dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';

import { ActionIcon, Checkbox } from '@mantine/core';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import styles from './checkbox-select.module.css';
import { Icon } from '/@/components/icon/icon';
import { dndUtils, DragOperation, DragTarget } from '/@/utils/drag-drop';

interface CheckboxSelectProps {
    data: { label: string; value: string }[];
    enableDrag?: boolean;
    onChange: (value: string[]) => void;
    value: string[];
}

export function CheckboxSelect({
    data,
    enableDrag,
    onChange,
    value,
}: CheckboxSelectProps) {
    const handleChange = (values: string[]) => {
        onChange(values);
    };

    return (
        <div className={styles.container}>
            {data.map(option => (
                <CheckboxSelectItem
                    key={option.value}
                    enableDrag={enableDrag}
                    option={option}
                    values={value}
                    onChange={handleChange}
                />
            ))}
        </div>
    );
}

interface CheckboxSelectItemProps {
    enableDrag?: boolean;
    onChange: (values: string[]) => void;
    option: { label: string; value: string };
    values: string[];
}

function CheckboxSelectItem({ enableDrag, onChange, option, values }: CheckboxSelectItemProps) {
    const ref = useRef<HTMLInputElement | null>(null);
    const dragHandleRef = useRef<HTMLButtonElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggedOver, setIsDraggedOver] = useState<Edge | null>(null);

    useEffect(() => {
        if (!ref.current || !dragHandleRef.current || !enableDrag) {
            return;
        }

        return combine(
            draggable({
                element: dragHandleRef.current,
                getInitialData: () => {
                    const data = dndUtils.generateDragData({
                        id: [option.value],
                        operation: [DragOperation.REORDER],
                        type: DragTarget.GENERIC,
                    });
                    return data;
                },
                onDragStart: () => {
                    setIsDragging(true);
                },
                onDrop: () => {
                    setIsDragging(false);
                },
                onGenerateDragPreview: (data) => {
                    disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                },
            }),
            dropTargetForElements({
                canDrop: (args) => {
                    const data = args.source.data as unknown as DragData;
                    const isSelf = (args.source.data.id as string[])[0] === option.value;
                    return dndUtils.isDropTarget(data.type, [DragTarget.GENERIC]) && !isSelf;
                },
                element: ref.current,
                getData: ({ element, input }) => {
                    const data = dndUtils.generateDragData({
                        id: [option.value],
                        operation: [DragOperation.REORDER],
                        type: DragTarget.GENERIC,
                    });

                    return attachClosestEdge(data, {
                        allowedEdges: ['top', 'bottom'],
                        element,
                        input,
                    });
                },
                onDrag: (args) => {
                    const closestEdgeOfTarget: Edge | null = extractClosestEdge(args.self.data);
                    setIsDraggedOver(closestEdgeOfTarget);
                },
                onDragLeave: () => {
                    setIsDraggedOver(null);
                },
                onDrop: (args) => {
                    const closestEdgeOfTarget: Edge | null = extractClosestEdge(args.self.data);

                    const from = args.source.data.id as string[];
                    const to = args.self.data.id as string[];

                    const newOrder = dndUtils.reorderById({
                        edge: closestEdgeOfTarget,
                        idFrom: from[0],
                        idTo: to[0],
                        list: values,
                    });

                    onChange(newOrder);
                    setIsDraggedOver(null);
                },
            }),
        );
    }, [values, enableDrag, onChange, option.value]);

    return (
        <div
            ref={ref}
            className={clsx(styles.item, {
                [styles.dragging]: isDragging,
                [styles.draggedOverTop]: isDraggedOver === 'top',
                [styles.draggedOverBottom]: isDraggedOver === 'bottom',
            })}
        >
            {enableDrag && (
                <ActionIcon
                    ref={dragHandleRef}
                    className={styles.dragHandle}
                    size="xs"
                    variant="default"
                >
                    <Icon icon="dragVertical" />
                </ActionIcon>
            )}
            <Checkbox
                checked={values.includes(option.value)}
                classNames={{
                    body: styles.body,
                    label: styles.label,
                    labelWrapper: styles.labelWrapper,
                    root: styles.root,
                }}
                label={option.label}
                onChange={(e) => {
                    onChange(e.target.checked ? [...values, option.value] : values.filter(v => v !== option.value));
                }}
            />
        </div>
    );
}
