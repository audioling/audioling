// https://mantine.dev/hooks/use-focus-trap/
import { useFocusTrap as mantineUseFocusTrap } from '@mantine/hooks';

export const useFocusTrap = (active?: boolean) => {
    return mantineUseFocusTrap(active);
};
