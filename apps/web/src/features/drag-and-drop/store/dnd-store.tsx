import type { DragControls } from 'framer-motion';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/react/shallow';

type State = {
    activeElementIds: string[];
    dragControls: DragControls | null;
    dragNodeRef: HTMLDivElement | null;
    dropNodeRef: HTMLDivElement | null;
    overElementId: string | null;
};

type Actions = {
    setDragControls: (controls: DragControls | null) => void;
    setDragNodeRef: (node: HTMLElement | null) => void;
    setDropNodeRef: (node: HTMLElement | null) => void;
};

export type DndSlice = State & Actions;

export const useDndStore = create<State & Actions>()(
    devtools(
        immer((set) => ({
            activeElementIds: [],
            dragControls: null,
            dragNodeRef: null,
            dropNodeRef: null,
            overElementId: null,
            setDragControls: (controls) => {
                set(() => ({
                    dragControls: controls,
                }));
            },
            setDragNodeRef: (node) => {
                set(() => ({
                    dragNodeRef: node,
                }));
            },
            setDropNodeRef: (node) => {
                set(() => ({
                    dropNodeRef: node,
                }));
            },
        })),
        { name: 'dnd-store' },
    ),
);

export const useDroppable = () => {
    return useDndStore(
        useShallow((state) => ({
            active: state.activeElementIds,
            over: state.overElementId,
        })),
    );
};

export const useDraggable = (props: { id: string }) => {
    const { id } = props;

    return useDndStore(
        useShallow((state) => ({
            active: state.activeElementIds,
            dragControls: state.dragControls,
            isDragging: state.activeElementIds.includes(id),
            over: state.overElementId,
            setDragNodeRef: state.setDragNodeRef,
        })),
    );
};

export const useSetDragControls = () => {
    return useDndStore((state) => state.setDragControls);
};
