import type { Ref } from 'react';
import { forwardRef } from 'react';
import { type AppIcon } from '@/features/ui/icon/icon.tsx';
import { Select } from '@/features/ui/select/select.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import type { Sizes } from '@/themes/index.ts';

interface SelectInputProps {
    data: {
        disabled?: boolean;
        label: string;
        leftIcon?: keyof typeof AppIcon;
        rightIcon?: keyof typeof AppIcon;
        value: string;
    }[];
    description?: string;
    label?: string;
    leftSection?: React.ReactNode;
    onChange: (value: string | null) => void;
    radius?: Sizes;
    required?: boolean;
    rightSection?: React.ReactNode;
    size?: Sizes;
    value: string;
}

export const SelectInput = forwardRef((props: SelectInputProps, ref: Ref<HTMLInputElement>) => {
    const { data, description, label, onChange, radius, required, size, value } = props;

    const inputValue = data.find((item) => item.value === value)?.label;

    return (
        <Select value={value} onChange={onChange}>
            <Select.Target>
                <TextInput
                    ref={ref}
                    description={description}
                    label={label}
                    radius={radius}
                    required={required}
                    rightIcon="arrowDownS"
                    rightIconProps={{ state: 'secondary' }}
                    size={size}
                    value={inputValue}
                />
            </Select.Target>
            <Select.Portal>
                <Select.Content>
                    <Select.Viewport>
                        {data.map((item) => (
                            <Select.Item
                                key={item.value}
                                disabled={item.disabled}
                                value={item.value}
                            >
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select>
    );
});

SelectInput.displayName = 'SelectInput';
