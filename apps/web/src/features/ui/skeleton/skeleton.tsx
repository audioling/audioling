import type { CSSProperties } from 'react';
import clsx from 'clsx';
import RSkeleton from 'react-loading-skeleton';
import styles from './skeleton.module.scss';
import 'react-loading-skeleton/dist/skeleton.css';

interface SkeletonProps {
    baseColor?: string;
    borderRadius?: string;
    className?: string;
    containerClassName?: string;
    count?: number;
    direction?: 'ltr' | 'rtl';
    enableAnimation?: boolean;
    height?: string | number;
    inline?: boolean;
    style?: CSSProperties;
    width?: string | number;
}

export function Skeleton(props: SkeletonProps) {
    return (
        <RSkeleton
            {...props}
            className={clsx(styles.skeleton, props.className)}
            containerClassName={styles.skeletonContainer}
        />
    );
}
