import type { ButtonVariant } from '@mantine/core';
import { MantineSize } from '@mantine/core';

declare module '@mantine/core' {
    export interface SegmentedControlProps {
        variant?: 'filled' | 'default';
    }
}
