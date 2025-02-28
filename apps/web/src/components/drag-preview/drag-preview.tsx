import styles from './drag-preview.module.scss';

interface DragPreviewProps {
    itemCount: number;
}

export function DragPreview(props: DragPreviewProps) {
    const { itemCount } = props;

    return <div className={styles.preview}>{itemCount} items</div>;
}
