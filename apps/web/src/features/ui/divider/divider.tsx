import * as Separator from '@radix-ui/react-separator';
import clsx from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './divider.module.scss';

interface DividerProps extends React.ComponentPropsWithoutRef<'div'> {
    decorative?: boolean;
    label?: string;
    labelPosition?: 'left' | 'right' | 'center';
    mb?: Sizes;
    mt?: Sizes;
    mx?: Sizes;
    my?: Sizes;
    orientation?: 'horizontal' | 'vertical';
}

export const Divider = (props: DividerProps) => {
    const { decorative, mb, mt, mx, my, orientation, ...htmlProps } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles.topXs]: mt === 'xs' || my === 'xs',
        [styles.topSm]: mt === 'sm' || my === 'sm',
        [styles.topMd]: mt === 'md' || my === 'md',
        [styles.topLg]: mt === 'lg' || my === 'lg',
        [styles.topXl]: mt === 'xl' || my === 'xl',
        [styles.bottomXs]: mb === 'xs' || my === 'xs',
        [styles.bottomSm]: mb === 'sm' || my === 'sm',
        [styles.bottomMd]: mb === 'md' || my === 'md',
        [styles.bottomLg]: mb === 'lg' || my === 'lg',
        [styles.bottomXl]: mb === 'xl' || my === 'xl',
        [styles.xXs]: mx === 'xs',
        [styles.xSm]: mx === 'sm',
        [styles.xMd]: mx === 'md',
        [styles.xLg]: mx === 'lg',
        [styles.xXl]: mx === 'xl',
    });

    return (
        <Separator.Root
            className={rootClassNames}
            decorative={decorative}
            // label={label}
            // labelPosition={labelPosition}
            orientation={orientation}
            {...htmlProps}
        />
    );
};
