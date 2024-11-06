import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './page-container.module.scss';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export function PageContainer(props: PageContainerProps) {
    const { children, className, ...htmlProps } = props;

    return (
        <div className={clsx(styles.container, className)} {...htmlProps}>
            {children}
        </div>
    );
}
