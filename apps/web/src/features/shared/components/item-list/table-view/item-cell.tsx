import type { ReactNode } from 'react';
import { Text } from '@mantine/core';
import clsx from 'clsx';
import styles from './item-cell.module.css';

interface ItemCellProps {
    children: ReactNode;
    className?: string;
    isSecondary?: boolean;
    justify?: 'center' | 'start' | 'end';

}

export function ItemCell({ children, className, isSecondary, justify }: ItemCellProps) {
    return (
        <Text
            className={clsx(className, {
                [styles.cell]: true,
                [styles.center]: justify === 'center',
                [styles.start]: justify === 'start',
                [styles.end]: justify === 'end',
            })}
            variant={isSecondary ? 'secondary' : undefined}
        >
            {children}
        </Text>
    );
}
