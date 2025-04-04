import type { MouseEvent, ReactNode } from 'react';
import { Text } from '@mantine/core';
import clsx from 'clsx';
import { NavLink, type NavLinkProps } from 'react-router';
import styles from './item-cell.module.css';

interface ItemCellProps {
    children: ReactNode;
    className?: string;
    group?: boolean;
    isSecondary?: boolean;
    justify?: 'center' | 'start' | 'end';
    lineClamp?: number;
    onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function ItemCell({ children, className, group, isSecondary, justify, lineClamp = 1, onClick }: ItemCellProps) {
    if (lineClamp === 1) {
        return (
            <div className={clsx(styles.cell, {
                [styles.center]: justify === 'center',
                [styles.start]: justify === 'start',
                [styles.end]: justify === 'end',
                [styles.group]: group,
            })}
            >
                <Text
                    className={clsx(className, {
                        [styles.inner]: true,
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

interface ItemCellLinkProps {
    children: ReactNode;
    to: NavLinkProps['to'];
}

export function ItemCellLink({ children, to }: ItemCellLinkProps) {
    return (
        <NavLink className={styles.link} to={to}>
            {children}
        </NavLink>
    );
}
