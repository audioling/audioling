import type { ButtonVariant } from '@mantine/core';
import type { AppIcon } from '../src/components/icon/icon';
import { MantineSize } from '@mantine/core';

declare module '@mantine/core' {
    export interface SegmentedControlProps {
        variant?: 'filled' | 'default';
    }

    export interface TextProps {
        variant?:
            | 'default'
            | 'default-ellipsis'
            | 'secondary'
            | 'secondary-ellipsis'
            | 'monospace'
            | 'monospace-secondary';
    }

    export interface ButtonProps {
        variant?: 'secondary' | 'default' | 'filled' | 'subtle' | 'transparent' | 'white' | 'outline';
    }
}
