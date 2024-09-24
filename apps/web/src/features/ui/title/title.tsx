import { clsx } from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './title.module.scss';

interface TitleProps extends React.ComponentPropsWithoutRef<'div'> {
    isSecondary?: boolean;
    order: number;
    size?: Sizes;
    weight?: Sizes;
}

export const Title = (props: TitleProps) => {
    const { children, order, size, weight, isSecondary, ...htmlProps } = props;

    const HeaderComponent = getHeaderComponent(order);

    const classNames = clsx({
        [styles[`size-${size}`]]: true,
        [styles[`weight-${weight}`]]: true,
        [styles.secondary]: isSecondary,
    });

    return (
        <HeaderComponent
            className={classNames}
            {...htmlProps}
        >
            {children}
        </HeaderComponent>
    );
};

function getHeaderComponent(order: number) {
    switch (order) {
        case 1:
            return 'h1';
        case 2:
            return 'h2';
        case 3:
            return 'h3';
        case 4:
            return 'h4';
        case 5:
            return 'h5';
        case 6:
            return 'h6';
        default:
            return 'h1';
    }
}
