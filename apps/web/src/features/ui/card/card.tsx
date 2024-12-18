import type { HTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { createRoot } from 'react-dom/client';
import { NavLink } from 'react-router';
import type { PlayType } from '@/features/player/stores/player-store.tsx';
import { CardControls } from '@/features/ui/card/card-controls.tsx';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import { Image } from '@/features/ui/image/image.tsx';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import styles from './card.module.scss';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    componentState: 'loading' | 'loaded' | 'scrolling';
    controls: {
        onDragInitialData?: (id: string) => DragData;
        onDragStart?: (id: string) => void;
        onDrop?: (id: string) => void;
        onMore?: (id: string) => void;
        onPlay: (id: string, playType: PlayType) => void;
    };
    id: string;
    image: string;
    libraryId: string;
    metadata: {
        path: string;
        text: string;
    }[];
    metadataLines: number;
    titledata: {
        path: string;
        text: string;
    };
}

export function Card(props: CardProps) {
    const {
        componentState,
        controls,
        id,
        image,
        libraryId,
        metadata,
        metadataLines,
        titledata,
        className,
        ...htmlProps
    } = props;

    const queryClient = useQueryClient();
    const ref = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        return combine(
            draggable({
                element: ref.current,
                getInitialData: () => {
                    return controls.onDragInitialData?.(id) ?? {};
                },
                onDragStart: async () => {
                    setIsDragging(true);
                    return controls.onDragStart?.(id);
                },
                onDrop: () => setIsDragging(false),
                onGenerateDragPreview: (data) => {
                    disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                    setCustomNativeDragPreview({
                        nativeSetDragImage: data.nativeSetDragImage,
                        render: ({ container }) => {
                            const root = createRoot(container);
                            root.render(<DragPreview itemCount={1} />);
                        },
                    });
                },
            }),
        );
    }, [controls, id, image, libraryId, queryClient, titledata.text]);

    switch (componentState) {
        default: {
            return (
                <div
                    ref={ref}
                    className={clsx(styles.card, className, {
                        [styles.dragging]: isDragging,
                    })}
                    {...htmlProps}
                >
                    <div className={styles.imageContainer}>
                        <Skeleton className={styles.image} />
                    </div>
                    <div className={styles.descriptionContainer}>
                        <Text className={styles.description}>&nbsp;</Text>
                        {Array.from({ length: metadataLines }).map((_, metadataIndex) => (
                            <Text
                                key={`${id}-metadata-${metadataIndex}`}
                                className={styles.description}
                            >
                                &nbsp;
                            </Text>
                        ))}
                    </div>
                </div>
            );
        }
        case 'loaded': {
            return (
                <div
                    ref={ref}
                    className={clsx(styles.card, className, {
                        [styles.dragging]: isDragging,
                    })}
                    {...htmlProps}
                >
                    <div
                        className={styles.imageContainer}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <Image className={styles.image} src={image} />
                        {isHovering && (
                            <CardControls
                                id={id}
                                onMore={controls.onMore}
                                onPlay={controls.onPlay}
                            />
                        )}
                    </div>
                    <div className={styles.descriptionContainer}>
                        <NavLink className={styles.description} to={titledata.path}>
                            {titledata.text}
                        </NavLink>
                        {metadata.map(({ path, text }, index) => (
                            <NavLink
                                key={index}
                                className={clsx(styles.description, styles.secondary)}
                                to={path}
                            >
                                {text}
                            </NavLink>
                        ))}
                    </div>
                </div>
            );
        }
    }
}
