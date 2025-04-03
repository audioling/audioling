import type { ItemCardProps } from '/@/features/shared/components/item-card/item-card';
import type { DragData } from '/@/utils/drag-drop';
import type { MouseEvent } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { Checkbox, Text } from '@mantine/core';
import clsx from 'clsx';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './default-item-card.module.css';
import { DragPreview } from '/@/components/drag-preview/drag-preview';
import { Skeleton } from '/@/components/skeleton/skeleton';
import { ItemCardControls } from '/@/features/shared/components/item-card/item-card-controls';
import { ItemImage } from '/@/features/shared/components/item-image/item-image';

export function DefaultItemCard({
    data,
    id,
    index,
    isDragging,
    isSelected,
    lines,
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
}: Omit<ItemCardProps<any>, 'type'>) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    const item = useMemo(() => ({
        id: id as string,
        serverId: data?._serverId || '',
    }), [id, data]);

    useEffect(() => {
        if (!ref.current || !id || !data) {
            return;
        }

        return combine(
            draggable({
                element: ref.current,
                getInitialData: () => {
                    return onDragInitialData?.(item, reducers) ?? {};
                },
                onDragStart: async () => {
                    reducers?.setIsDragging(true);
                    return onDragStart?.(item, reducers);
                },
                onDrop: () => {
                    reducers?.setIsDragging(false);
                },
                onGenerateDragPreview: (data) => {
                    disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                    setCustomNativeDragPreview({
                        nativeSetDragImage: data.nativeSetDragImage,
                        render: ({ container }) => {
                            const root = createRoot(container);
                            root.render(
                                <DragPreview itemCount={(data.source.data as unknown as DragData<any>).id.length} />,
                            );
                        },
                    });
                },
            }),
        );
    }, [onDragInitialData, onDragStart, onDrop, data, id, isHovering, reducers, item]);

    if (!data || !id) {
        return <DefaultItemCardSkeleton lines={lines || []} />;
    }

    return (
        <div
            ref={ref}
            className={clsx(styles.container, {
                [styles.dragging]: isDragging,
            })}
            tabIndex={0}
            onClick={(e) => {
                onClick?.(item, e as unknown as MouseEvent<HTMLDivElement | HTMLButtonElement>, reducers);
            }}
            onContextMenu={(e) => {
                onContextMenu?.(item, e as unknown as MouseEvent<HTMLButtonElement>, reducers);
            }}
            onFocus={() => setIsHovering(true)}
        >
            <div
                className={clsx(styles.imageSection, { [styles.hovered]: isHovering })}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <ItemImage className={clsx(styles.image, { [styles.selected]: isSelected })} id={id} size="card" />
                {(isHovering || isSelected) && onItemSelection && (
                    <Checkbox
                        checked={isSelected}
                        className={styles.selection}
                        onChange={(e) => {
                            onItemSelection?.(item, index, (e.nativeEvent as unknown as MouseEvent<HTMLButtonElement>));
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    />
                )}
                {isHovering && (
                    <ItemCardControls
                        id={data.id}
                        reducers={reducers}
                        serverId={data._serverId}
                        userFavorite={data.userFavorite}
                        onContextMenu={onContextMenu}
                        onFavorite={onFavorite}
                        onPlay={onPlay}
                        onUnfavorite={onUnfavorite}
                    />
                )}
            </div>
            <div className={styles.linesSection}>
                <div className={styles.lines}>
                    {(lines || []).map((line, index) => (
                        <Line
                            key={line.property as string}
                            data={data}
                            index={index}
                            property={line.property}
                            transform={line.transform}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface DefaultItemCardSkeletonProps {
    lines: {
        property: string;
    }[];
}

export function DefaultItemCardSkeleton({ lines }: DefaultItemCardSkeletonProps) {
    return (
        <div className={styles.container}>
            <div className={styles.imageSection}>
                <Skeleton className={styles.skeletonImage} />
            </div>
            <div className={styles.linesSection}>
                <div className={clsx(styles.lines, styles.skeletonLines)}>
                    {lines.map(line => (
                        <div key={line.property as string}>
                        &nbsp;
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Line<TData extends Record<string, any>>({
    data,
    index,
    property,
    transform,
}: {
    data: TData;
    index: number;
    property: string;
    transform?: (data: unknown) => string;
}) {
    if (!property.includes('.')) {
        if (typeof transform === 'function') {
            const line = transform(data);
            return <Text variant={index === 0 ? undefined : 'secondary'}>{line || '\u00A0'}</Text>;
        }

        return <Text variant={index === 0 ? undefined : 'secondary'}>{data[property] || '\u00A0'}</Text>;
    }

    const [rootProperty, subProperty] = property.split('.');

    const propertyData = data[rootProperty].map((item: TData, i: number) => ({
        id: item.id || `${index}-${i}`,
        name: item[subProperty],
    }));

    return (
        <div className={styles.inline}>
            <Text variant={index === 0 ? undefined : 'secondary'}>
                {propertyData.map((item: { id: string; name: string }, i: number) => (
                    <Fragment key={item.id}>
                        {item.name || '\u00A0'}
                        {i !== propertyData.length - 1 && ' • '}
                    </Fragment>
                ))}
            </Text>

        </div>
    );
}
