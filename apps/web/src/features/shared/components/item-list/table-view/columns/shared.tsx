import clsx from 'clsx';
import styles from './column.module.css';
import { Skeleton } from '/@/components/skeleton/skeleton';

export function EmptyCell() {
    return <div className={styles.cell}>&nbsp;</div>;
}

interface CellSkeletonProps {
    height?: number;
    isCentered?: boolean;
    width?: number;
}

export function CellSkeleton({ height = 20, isCentered, width = 30 }: CellSkeletonProps) {
    return (
        <div className={clsx(styles.skeleton)}>
            <Skeleton height={height} isCentered={isCentered} width={width} />
        </div>
    );
}
