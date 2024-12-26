import type { Ref } from 'react';
import { forwardRef, useState } from 'react';
import type { TextInputProps } from '@/features/ui/text-input/text-input.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import styles from './number-input.module.scss';

interface NumberInputProps extends Omit<TextInputProps, 'onChange'> {
    max?: number;
    min?: number;
    onChange?: (value: number) => void;
}

export const NumberInput = forwardRef((props: NumberInputProps, ref: Ref<HTMLInputElement>) => {
    const { max, min, onChange, ...htmlProps } = props;

    const [value, setValue] = useState<number | undefined>(htmlProps.value as number);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value === '') {
            return setValue(undefined);
        }

        const num = Number(value);

        if (max && num > max) {
            onChange?.(max);
            return setValue(max);
        }

        if (min && num < min) {
            onChange?.(min);
            return setValue(min);
        }

        setValue(num);
        onChange?.(num);
    };

    return (
        <TextInput
            ref={ref}
            className={styles.input}
            max={max}
            min={min}
            type="number"
            {...htmlProps}
            value={value}
            onChange={handleChange}
        />
    );
});

NumberInput.displayName = 'NumberInput';
