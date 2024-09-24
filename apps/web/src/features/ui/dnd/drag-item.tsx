import React, { useEffect } from 'react';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';
import { clsx } from 'clsx';
import styles from './drag-item.module.scss';

export interface Props {
    color?: string;
    disabled?: boolean;
    dragOverlay?: boolean;
    dragging?: boolean;
    fadeIn?: boolean;
    handle?: boolean;
    handleProps?: any;
    height?: number;
    index?: number;
    listeners?: DraggableSyntheticListeners;
    onRemove?(): void;
    renderItem?(args: {
        dragOverlay: boolean;
        dragging: boolean;
        fadeIn: boolean;
        index: number | undefined;
        listeners: DraggableSyntheticListeners;
        ref: React.Ref<HTMLElement>;
        sorting: boolean;
        style: React.CSSProperties | undefined;
        transform: Props['transform'];
        transition: Props['transition'];
        value: Props['value'];
    }): React.ReactElement;
    sorting?: boolean;
    style?: React.CSSProperties;
    transform?: Transform | null;
    transition?: string | null;
    value: React.ReactNode;
    wrapperStyle?: React.CSSProperties;
}

export const DragItem = React.memo(
    React.forwardRef<HTMLLIElement, Props>(
        (
            {
                color,
                dragOverlay,
                dragging,
                disabled,
                fadeIn,
                handle,
                handleProps,
                height,
                index,
                listeners,
                onRemove,
                renderItem,
                sorting,
                style,
                transition,
                transform,
                value,
                wrapperStyle,
                ...props
            },
            ref,
        ) => {
            useEffect(() => {
                if (!dragOverlay) {
                    return;
                }

                document.body.style.cursor = 'grabbing';

                return () => {
                    document.body.style.cursor = '';
                };
            }, [dragOverlay]);

            return renderItem ? (
                renderItem({
                    dragOverlay: Boolean(dragOverlay),
                    dragging: Boolean(dragging),
                    fadeIn: Boolean(fadeIn),
                    index,
                    listeners,
                    ref,
                    sorting: Boolean(sorting),
                    style,
                    transform,
                    transition,
                    value,
                })
            ) : (
                <li
                    ref={ref}
                    className={clsx(
                        styles.Wrapper,
                        fadeIn && styles.fadeIn,
                        sorting && styles.sorting,
                        dragOverlay && styles.dragOverlay,
                    )}
                    style={
                        {
                            ...wrapperStyle,
                            '--color': color,
                            '--index': index,
                            '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
                            '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
                            '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
                            '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
                            transition: [transition, wrapperStyle?.transition]
                                .filter(Boolean)
                                .join(', '),
                        } as React.CSSProperties
                    }
                >
                    <div
                        className={clsx(
                            styles.Item,
                            dragging && styles.dragging,
                            handle && styles.withHandle,
                            dragOverlay && styles.dragOverlay,
                            disabled && styles.disabled,
                            color && styles.color,
                        )}
                        data-cypress="draggable-item"
                        style={style}
                        {...(!handle ? listeners : undefined)}
                        {...props}
                        tabIndex={!handle ? 0 : undefined}
                    >
                        {value}
                        <span className={styles.Actions}>
                            {/* {onRemove ? (
                <Remove
                  className={styles.Remove}
                  onClick={onRemove}
                />
              ) : null}
              {handle ? (
                <Handle
                  {...handleProps}
                  {...listeners}
                />
              ) : null} */}
                        </span>
                    </div>
                </li>
            );
        },
    ),
);
