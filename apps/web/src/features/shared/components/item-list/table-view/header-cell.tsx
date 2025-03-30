import type { ReactNode } from 'react';
import { Text } from '@mantine/core';
import clsx from 'clsx';
import styles from './header-cell.module.css';

interface HeaderCellProps {
    align?: 'center' | 'start' | 'end';
    children: ReactNode;
    className?: string;
    justify?: 'center' | 'start' | 'end';
}

export function HeaderCell({ align = 'center', children, className, justify }: HeaderCellProps) {
    return (
        <Text
            className={clsx(className, styles.headerCell, {
                [styles.justifyCenter]: justify === 'center',
                [styles.justifyStart]: justify === 'start',
                [styles.justifyEnd]: justify === 'end',
                [styles.alignCenter]: align === 'center',
                [styles.alignStart]: align === 'start',
                [styles.alignEnd]: align === 'end',
            })}
        >
            {children}
        </Text>
    );
}
