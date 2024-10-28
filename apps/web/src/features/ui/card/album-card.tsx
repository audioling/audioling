import type { HTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { LibraryItemType } from '@repo/shared-types';
import clsx from 'clsx';
import { createRoot } from 'react-dom/client';
import { NavLink } from 'react-router-dom';
import { DragPreview } from '@/features/ui/drag-preview/drag-preview.tsx';
import styles from './album-card.module.scss';

interface AlbumCardProps extends HTMLAttributes<HTMLDivElement> {
    image: string;
    metadata: {
        path: string;
        text: string;
    }[];
    titledata: {
        path: string;
        text: string;
    };
}

export function AlbumCard(props: AlbumCardProps) {
    const { image, metadata, titledata, className, ...htmlProps } = props;
    const ref = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        return combine(
            draggable({
                element: ref.current,
                getInitialData: () => ({
                    image,
                    title: titledata.text,
                    type: 'album',
                }),
                onDragStart: () => setIsDragging(true),
                onDrop: () => setIsDragging(false),
                onGenerateDragPreview: (data) => {
                    disableNativeDragPreview({ nativeSetDragImage: data.nativeSetDragImage });
                    setCustomNativeDragPreview({
                        nativeSetDragImage: data.nativeSetDragImage,
                        render: ({ container }) => {
                            const root = createRoot(container);
                            root.render(<DragPreview itemCount={1} type={LibraryItemType.ALBUM} />);
                        },
                    });
                },
            }),
        );
    }, [image, titledata.text]);

    return (
        <div
            ref={ref}
            className={clsx(styles.card, className, {
                [styles.dragging]: isDragging,
            })}
            {...htmlProps}
        >
            <div className={styles.imageContainer}>
                <img className={styles.image} src={image} />
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
