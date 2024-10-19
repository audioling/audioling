import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Active, UniqueIdentifier } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DragHandle, SortableItem } from '@/features/ui/dnd/sortable-item/sortable-item.tsx';
import { SortableOverlay } from '@/features/ui/dnd/sortable-overlay/sortable-overlay.tsx';

interface BaseItem {
    id: UniqueIdentifier;
}

interface Props<T extends BaseItem> {
    items: T[];
    onChange(items: T[]): void;
    renderItem(item: T, activeIndex: number): ReactNode;
}

export function SortableList<T extends BaseItem>({ items, onChange, renderItem }: Props<T>) {
    const [active, setActive] = useState<Active | null>(null);
    const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items]);
    const activeIndex = useMemo(
        () => items.findIndex((item) => item.id === active?.id),
        [active, items],
    );
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    return (
        <DndContext
            sensors={sensors}
            onDragCancel={() => {
                setActive(null);
            }}
            onDragEnd={({ active, over }) => {
                if (over && active.id !== over?.id) {
                    const activeIndex = items.findIndex(({ id }) => id === active.id);
                    const overIndex = items.findIndex(({ id }) => id === over.id);

                    onChange(arrayMove(items, activeIndex, overIndex));
                }
                setActive(null);
            }}
            onDragStart={({ active }) => {
                setActive(active);
            }}
        >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                    <React.Fragment key={item.id}>{renderItem(item, activeIndex)}</React.Fragment>
                ))}
            </SortableContext>
            <SortableOverlay>
                {activeItem ? renderItem(activeItem, activeIndex) : null}
            </SortableOverlay>
        </DndContext>
    );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
