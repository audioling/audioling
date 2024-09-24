import type { DividerProps as MantineDividerProps } from '@mantine/core';
import { Divider as MantineDivider } from '@mantine/core';
import clsx from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './divider.module.scss';

interface DividerProps extends React.ComponentPropsWithoutRef<'div'> {
    label?: string;
    labelPosition?: 'left' | 'right' | 'center';
    mb?: Sizes;
    mt?: Sizes;
    mx?: Sizes;
    my?: Sizes;
    orientation?: 'horizontal' | 'vertical';
}

export const Divider = (props: DividerProps) => {
    const { label, labelPosition, mb, mt, mx, my, orientation, ...htmlProps } = props;

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

    const classNames: MantineDividerProps['classNames'] = {
        root: rootClassNames,
    };

    return (
        <MantineDivider
            classNames={classNames}
            label={label}
            labelPosition={labelPosition}
            orientation={orientation}
            {...htmlProps}
        />
    );
};
