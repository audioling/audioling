import type { LibraryItemType } from '@repo/shared-types';
import styles from './drag-preview.module.scss';

interface DragPreviewProps {
    itemCount: number;
    type: LibraryItemType;
}

export function DragPreview(props: DragPreviewProps) {
    const { itemCount, type } = props;

    return (
        <div className={styles.preview}>
            Dragging {itemCount} {type}...
        </div>
    );
}
