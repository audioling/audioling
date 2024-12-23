import type { Ref } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import type { Sizes } from '@/themes/index.ts';
import styles from './text-area.module.scss';

export interface TextAreaProps extends Omit<React.ComponentPropsWithoutRef<'textarea'>, 'size'> {
    description?: string;
    label?: string;
    leftSection?: React.ReactNode;
    placeholder?: string;
    radius?: Sizes;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
    rightSection?: React.ReactNode;
    size?: Sizes;
    spellCheck?: boolean;
}

export const TextArea = forwardRef((props: TextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
    const {
        description,
        label,
        placeholder,
        radius = 'md',
        resize = 'none',
        rightSection,
        size = 'md',
        spellCheck = false,
        ...htmlProps
    } = props;

    const rootClassNames = clsx({
        [styles.root]: true,
        [styles[`size-${size}`]]: true,
    });

    const inputClassNames = clsx({
        [styles.input]: true,
        [styles[`size-${size}`]]: true,
        [styles[`radius-${radius}`]]: true,
        [styles.rightSection]: !!rightSection,
        [styles[`resize-${resize}`]]: true,
    });

    return (
        <div className={rootClassNames}>
            {label && <label className={styles.label}>{label}</label>}
            {description && <p className={styles.description}>{description}</p>}
            <textarea
                ref={ref}
                className={inputClassNames}
                placeholder={placeholder}
                spellCheck={spellCheck}
                {...htmlProps}
            />
        </div>
    );
});

TextArea.displayName = 'TextArea';
