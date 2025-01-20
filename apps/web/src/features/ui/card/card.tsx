import type { HTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import type { LibraryItemType } from '@repo/shared-types';
import clsx from 'clsx';
import { createRoot } from 'react-dom/client';
import { NavLink } from 'react-router';
import type { PlayType } from '@/features/player/stores/player-store.tsx';
import { ItemImage } from '@/features/shared/item-image/item-image.tsx';
import { CardControls } from '@/features/ui/card/card-controls.tsx';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import { Skeleton } from '@/features/ui/skeleton/skeleton.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import styles from './card.module.scss';

export type BaseCardProps = HTMLAttributes<HTMLDivElement> & {
    isCircle?: boolean;
    metadataLines: number;
};

export type LoadingCardProps = BaseCardProps & {
    componentState: 'loading' | 'scrolling';
};

export type LoadedCardProps = BaseCardProps & {
    componentState: 'loaded';
    controls: {
        onDragInitialData?: (id: string) => DragData;
        onDragStart?: (id: string) => void;
        onDrop?: (id: string) => void;
        onFavorite?: (id: string, libraryId: string) => void;
        onMore?: (id: string) => void;
        onPlay: (id: string, playType: PlayType) => void;
        onUnfavorite?: (id: string, libraryId: string) => void;
        userFavorite?: boolean;
    };
    id: string;
    image: string;
    itemType: LibraryItemType;
    libraryId: string;
    metadata: {
        path: string;
        text: string;
    }[];
    titledata: {
        path: string;
        text: string;
    };
};

export type CardProps = LoadingCardProps | LoadedCardProps;

export function Card(props: CardProps) {
    const { componentState, metadataLines, className, ...htmlProps } = props;

    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Only access these props if we're in loaded state
    const loadedProps = componentState === 'loaded' ? props : null;

    useEffect(() => {
        if (!ref.current || componentState !== 'loaded') return;

        if (componentState === 'loaded' && loadedProps?.controls && loadedProps?.id) {
            return combine(
                draggable({
                    element: ref.current,
                    getInitialData: () => {
                        return loadedProps.controls.onDragInitialData?.(loadedProps.id) ?? {};
                    },
                    onDragStart: async () => {
                        setIsDragging(true);
                        return loadedProps.controls.onDragStart?.(loadedProps.id);
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
        }

        return;
    }, [componentState, loadedProps?.controls, loadedProps?.id]);

    switch (componentState) {
        default: {
            return (
                <div ref={ref} className={clsx(styles.card, className)} {...htmlProps}>
                    <div className={clsx(styles.baseImageContainer)}>
                        <Skeleton height="100%" width="100%" />
                    </div>
                    <div className={styles.descriptionContainer}>
                        {Array.from({ length: metadataLines + 1 }).map((_, metadataIndex) => (
                            <Text
                                key={`${loadedProps?.id}-metadata-${metadataIndex}`}
                                className={styles.description}
                            >
                                <Skeleton height="100%" width="100%" />
                            </Text>
                        ))}
                    </div>
                </div>
            );
        }
        case 'loaded': {
            if (!loadedProps) return null;

            return (
                <div
                    ref={ref}
                    className={clsx(styles.card, className, {
                        [styles.dragging]: isDragging,
                    })}
                >
                    <div
                        className={clsx(styles.imageContainer)}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <ItemImage
                            className={clsx(styles.image, {
                                [styles.circle]: props.isCircle,
                            })}
                            size="card"
                            src={[loadedProps.image]}
                        />
                        {isHovering && (
                            <CardControls
                                id={loadedProps.id}
                                itemType={loadedProps.itemType}
                                libraryId={loadedProps.libraryId}
                                userFavorite={loadedProps.controls.userFavorite}
                                onFavorite={loadedProps.controls.onFavorite}
                                onMore={loadedProps.controls.onMore}
                                onPlay={loadedProps.controls.onPlay}
                                onUnfavorite={loadedProps.controls.onUnfavorite}
                            />
                        )}
                    </div>
                    <div className={styles.descriptionContainer}>
                        <NavLink className={styles.description} to={loadedProps.titledata.path}>
                            {loadedProps.titledata.text}
                        </NavLink>
                        {loadedProps.metadata.map(({ path, text }, index) => (
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
