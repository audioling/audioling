import { useTranslation } from 'react-i18next';
import styles from './drag-preview.module.css';

interface DragPreviewProps {
    itemCount: number;
}

export function DragPreview(props: DragPreviewProps) {
    const { t } = useTranslation();
    const { itemCount } = props;

    return (
        <div className={styles.preview}>
            {t('app.actions.draggingItems', { count: itemCount })}
        </div>
    );
}
