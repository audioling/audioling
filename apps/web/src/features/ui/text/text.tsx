import { clsx } from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './text.module.scss';

interface TextProps extends React.ComponentPropsWithoutRef<'div'> {
    isCentered?: boolean;
    isEllipsis?: boolean;
    isNoSelect?: boolean;
    isSecondary?: boolean;
    size?: Sizes;
    weight?: Sizes;
}

export const Text = (props: TextProps) => {
    const {
        children,
        isCentered,
        isEllipsis,
        isNoSelect,
        isSecondary,
        size,
        weight,
        className,
        ...htmlProps
    } = props;

    const classNames = clsx({
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`weight-${weight || 'md'}`]]: true,
        [styles.secondary]: isSecondary,
        [styles.ellipsis]: isEllipsis,
        [styles.centered]: isCentered,
        [styles.noSelect]: isNoSelect,
    });

    return (
        <div className={clsx(classNames, className)} {...htmlProps}>
            {children}
        </div>
    );
};
