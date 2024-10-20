import type { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './paper.module.scss';

interface PaperProps extends React.ComponentPropsWithoutRef<'div'> {
    children: ReactNode;
}

export function Paper(props: PaperProps) {
    const { children, ...htmlProps } = props;
    return (
        <div {...htmlProps} className={clsx(styles.paper, htmlProps.className)}>
            {children}
        </div>
    );
}
