import React, { createContext, forwardRef, useContext, useMemo } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import type {
    DraggableAttributes,
    DraggableSyntheticListeners,
    UniqueIdentifier,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import styles from './sortable-item.module.scss';

export enum Position {
    Before = -1,
    After = 1,
}

interface SortableItemProps extends React.ComponentPropsWithoutRef<'div'> {
    activeIndex: number;
    entityId: UniqueIdentifier;
    insertPosition?: Position;
}

interface Context {
    attributes: Partial<DraggableAttributes>;
    listeners: DraggableSyntheticListeners;
    ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
    attributes: {},
    listeners: undefined,
    ref() {},
});

interface ItemProps {
    id: UniqueIdentifier;
    insertPosition?: Position;
    style: React.CSSProperties;
}

const Item = forwardRef<HTMLDivElement, PropsWithChildren<ItemProps>>(
    (props: PropsWithChildren<ItemProps>, ref) => {
        const { children, id, insertPosition, style } = props;

        const classNames = clsx({
            [styles.sortableItem]: true,
            [styles.insertAfter]: insertPosition === Position.After,
            [styles.insertBefore]: insertPosition === Position.Before,
        });
        return (
            <div ref={ref} className={classNames} data-id={id.toString()} style={style}>
                {children}
            </div>
        );
    },
);

Item.displayName = 'Item';

export function SortableItem(props: PropsWithChildren<SortableItemProps>) {
    const { children, entityId, activeIndex } = props;

    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isSorting,
        over,
        index,
    } = useSortable({
        id: entityId,
    });

    const context = useMemo(
        () => ({
            attributes,
            listeners,
            ref: setActivatorNodeRef,
        }),
        [attributes, listeners, setActivatorNodeRef],
    );
    const style: CSSProperties = {
        opacity: isDragging ? 0.4 : undefined,
        // transform: isSorting ? undefined : CSS.Translate.toString(transform),
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <SortableItemContext.Provider value={context}>
            <Item
                ref={setNodeRef}
                id={entityId}
                // insertPosition={
                //   over?.id === entityId
                //     ? index > activeIndex
                //       ? Position.After
                //       : Position.Before
                //     : undefined
                // }
                style={style}
            >
                {children}
            </Item>
        </SortableItemContext.Provider>
    );
}

export function DragHandle() {
    const { attributes, listeners, ref } = useContext(SortableItemContext);

    return (
        <button className={styles.dragHandle} {...attributes} {...listeners} ref={ref}>
            <svg viewBox="0 0 20 20" width="12">
                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
            </svg>
        </button>
    );
}
