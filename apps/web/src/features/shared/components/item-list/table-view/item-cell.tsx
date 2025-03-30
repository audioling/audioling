import type { MouseEvent, ReactNode } from 'react';
import { Text } from '@mantine/core';
import clsx from 'clsx';
import styles from './item-cell.module.css';

interface ItemCellProps {
    children: ReactNode;
    className?: string;
    isSecondary?: boolean;
    justify?: 'center' | 'start' | 'end';
    lineClamp?: number;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function ItemCell({ children, className, isSecondary, justify, lineClamp = 1, onClick }: ItemCellProps) {
    if (lineClamp === 1) {
        return (
            <Text
                className={clsx(className, {
                    [styles.cell]: true,
                    [styles.center]: justify === 'center',
                    [styles.start]: justify === 'start',
                    [styles.end]: justify === 'end',
                })}
                component="div"
                variant={isSecondary ? 'secondary' : undefined}
                onClick={onClick}
            >
                {children}
            </Text>
        );
    }

    return (
        <div className={styles.clampContainer}>
            <Text
                className={clsx(className, {
                    [styles.cell]: true,
                    [styles.center]: justify === 'center',
                    [styles.start]: justify === 'start',
                    [styles.end]: justify === 'end',
                    [styles['line-clamp-2']]: lineClamp === 2,
                    [styles['line-clamp-3']]: lineClamp === 3,
                })}
                component="div"
                variant={isSecondary ? 'secondary' : undefined}
                onClick={onClick}
            >
                {children}
            </Text>
        </div>
    );
}
