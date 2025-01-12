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
    onOpenChange?: (open: boolean) => void;
    radius?: Sizes;
    required?: boolean;
    rightSection?: React.ReactNode;
    size?: Sizes;
    stickyContent?: React.ReactNode;
    value: string;
}

export const SelectInput = forwardRef((props: SelectInputProps, ref: Ref<HTMLInputElement>) => {
    const {
        data,
        description,
        label,
        onChange,
        onOpenChange,
        radius,
        required,
        rightSection,
        size,
        stickyContent,
        value,
    } = props;

    const inputValue = data.find((item) => item.value === value)?.label;

    return (
        <Select value={value} onChange={onChange} onOpenChange={onOpenChange}>
            <Select.Target>
                <TextInput
                    ref={ref}
                    description={description}
                    label={label}
                    radius={radius}
                    required={required}
                    rightIcon="arrowDownS"
                    rightIconProps={{ state: 'secondary' }}
                    rightSection={rightSection}
                    size={size}
                    value={inputValue}
                />
            </Select.Target>
            <Select.Portal>
                <Select.Content stickyContent={stickyContent}>
                    <Select.Viewport>
                        {data.map((item) => (
                            <Select.Item
                                key={item.value}
                                disabled={item.disabled}
                                isSelected={item.value === value}
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
