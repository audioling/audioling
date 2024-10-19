import clsx from 'clsx';
import { Group } from '@/features/ui/group/group.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import styles from './alert.module.scss';

interface AlertProps {
    message: string;
    state: 'success' | 'error' | 'info' | 'warn';
    title?: string;
}

export const Alert = (props: AlertProps) => {
    const { message, title, state } = props;

    const classNames = clsx(styles.alert, {
        [styles.success]: state === 'success',
        [styles.error]: state === 'error',
        [styles.info]: state === 'info',
        [styles.warn]: state === 'warn',
    });

    return (
        <Stack className={classNames} gap="xs">
            <Group gap="xs">
                <Title order={1} size="sm">
                    {title}
                </Title>
            </Group>
            <Text size="md">{message}</Text>
        </Stack>
    );
};
