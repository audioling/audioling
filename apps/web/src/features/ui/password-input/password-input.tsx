import type { Ref } from 'react';
import { forwardRef, useState } from 'react';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import type { TextInputProps } from '@/features/ui/text-input/text-input.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';

export const PasswordInput = forwardRef((props: TextInputProps, ref: Ref<HTMLInputElement>) => {
    const { children, description, label, leftSection, placeholder, radius, size, ...htmlProps } =
        props;

    const [visible, setVisible] = useState(false);

    return (
        <TextInput
            ref={ref}
            description={description}
            label={label}
            leftSection={leftSection}
            placeholder={placeholder}
            radius={radius}
            rightSection={
                <IconButton
                    icon={visible ? 'visibilityOff' : 'visibility'}
                    variant="default"
                    onClick={() => setVisible((prev) => !prev)}
                />
            }
            size={size}
            type={visible ? 'text' : 'password'}
            {...htmlProps}
        >
            {children}
        </TextInput>
    );
});

PasswordInput.displayName = 'PasswordInput';
