import { Text } from '@mantine/core';
import clsx from 'clsx';
import styles from './header-cell.module.css';

interface HeaderCellProps {
    children: React.ReactNode;
    className?: string;
    justify?: 'center' | 'start' | 'end';
}

export function HeaderCell({ children, className, justify }: HeaderCellProps) {
    return (
        <Text
            className={clsx(className, styles.headerCell, {
                [styles.center]: justify === 'center',
                [styles.start]: justify === 'start',
                [styles.end]: justify === 'end',
            })}
        >
            {children}
        </Text>
    );
}
