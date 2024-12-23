import { forwardRef, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './paper.module.scss';

interface PaperProps extends React.ComponentPropsWithoutRef<'div'> {
    children: ReactNode;
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>((props, ref) => {
    const { children, ...htmlProps } = props;
    return (
        <div ref={ref} {...htmlProps} className={clsx(styles.paper, htmlProps.className)}>
            {children}
        </div>
    );
});

Paper.displayName = 'Paper';
