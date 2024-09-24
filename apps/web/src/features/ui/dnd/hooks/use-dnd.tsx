import { useCallback, useState } from 'react';
import type {
    Active,
    AutoScrollOptions,
    DragCancelEvent,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    Modifiers,
} from '@dnd-kit/core';
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

const defaultAnnouncements = {
    onDragCancel(e: DragCancelEvent) {
        const { over } = e;
        console.log(`Dragging was cancelled. Draggable item ${over?.id} was dropped.`);
    },
    onDragEnd(e: DragEndEvent) {
        const { active, over } = e;
        if (over) {
            console.log(`Draggable item ${active?.id} was dropped over droppable area ${over?.id}`);
            return;
        }

        console.log(`Draggable item ${active?.id} was dropped.`);
    },
    onDragOver(e: DragOverEvent) {
        const { active, over } = e;
        if (over?.id) {
            console.log(`Draggable item ${active?.id} was moved over droppable area ${over?.id}.`);
            return;
        }

        console.log(`Draggable item ${active?.id} is no longer over a droppable area.`);
    },
    onDragStart(e: DragStartEvent) {
        const { active } = e;
        console.log(`Picked up draggable item ${active?.id}.`);
    },
};

interface UseDndProps {
    modifiers?: Modifiers;
}

export const useDnd = (props: UseDndProps) => {
    const { modifiers } = props;

    const [, setActive] = useState<Active | null>(null);

    const dndSensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 500,
                distance: 0,
                tolerance: 0,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const onDragCancel = useCallback(() => {
        setActive(null);
    }, [setActive]);

    const onDragStart = useCallback((e: DragStartEvent) => {
        setActive(e.active);
    }, []);

    // const onDragEnd = useCallback(
    //   (e: DragEndEvent) => {
    //     const { active, over } = e;

    //     if (over && active.id !== over?.id) {
    //       const activeIndex = rows.findIndex(({ id }) => id === active?.id);
    //       const overIndex = rows.findIndex(({ id }) => id === over?.id);

    //       const reordered = reorderElements(rows, {
    //         elements: [rows[activeIndex]],
    //         newIndex: overIndex,
    //       });

    //       setRows(reordered);
    //     }

    //     setActive(null);
    //   },
    //   [rows, setRows],
    // );

    // const collisionDetection: CollisionDetection = closestCenter;

    const autoScroll: AutoScrollOptions = {
        acceleration: 35,
        canScroll: () => true,
        enabled: true,
    };

    const dndContextProps = {
        announcements: defaultAnnouncements,
        autoScroll,
        modifiers,
        onDragCancel,
        onDragStart,
        sensors: dndSensors,
    };

    return {
        dndContextProps,
        setActive,
    };
};
