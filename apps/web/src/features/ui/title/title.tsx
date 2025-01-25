import { clsx } from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './title.module.scss';

interface TitleProps extends React.ComponentPropsWithoutRef<'div'> {
    isNoSelect?: boolean;
    isSecondary?: boolean;
    isUnderlined?: boolean;
    lineClamp?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    order: number;
    size?: Sizes;
    weight?: Sizes;
}

export const Title = (props: TitleProps) => {
    const {
        className,
        children,
        order,
        size,
        weight,
        isNoSelect,
        isSecondary,
        isUnderlined,
        lineClamp,
        ...htmlProps
    } = props;

    const HeaderComponent = getHeaderComponent(order);

    const classNames = clsx({
        [styles[`size-${size || 'md'}`]]: true,
        [styles[`weight-${weight || 'lg'}`]]: true,
        [styles.secondary]: isSecondary,
        [styles.underlined]: isUnderlined,
        [styles.noSelect]: isNoSelect,
        [styles[`lineClamp${lineClamp}`]]: lineClamp,
    });

    return (
        <HeaderComponent className={clsx(className, classNames)} {...htmlProps}>
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
