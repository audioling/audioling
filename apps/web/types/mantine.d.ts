import type { ButtonVariant } from '@mantine/core';
import { MantineSize } from '@mantine/core';

declare module '@mantine/core' {
    export interface SegmentedControlProps {
        variant?: 'filled' | 'default';
    }

    export interface ActionIconProps {
        filled?: boolean;
    }

    export interface TextProps {
        isCentered?: boolean;
        isEllipsis?: boolean;
        isMonospace?: boolean;
        isNoSelect?: boolean;
        isSecondary?: boolean;
        isUppercase?: boolean;
    }
}
