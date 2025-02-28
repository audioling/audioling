import type { ReactNode } from 'react';
import { Button, Center, Group, Stack, Title } from '@mantine/core';
import { ErrorBoundary } from 'react-error-boundary';
import styles from './component-error-boundary.module.css';
import { ErrorBlock } from '/@/components/error-boundary/error-block';

interface ComponentErrorBoundaryProps {
    children: ReactNode;
    onReset?: () => void;
}

export function ComponentErrorBoundary({ children, onReset }: ComponentErrorBoundaryProps) {
    return (
        <ErrorBoundary fallbackRender={fallbackRender} onReset={onReset}>
            {children}
        </ErrorBoundary>
    );
}

function fallbackRender({
    error,
    resetErrorBoundary,
}: {
    error: Error;
    resetErrorBoundary: () => void;
}) {
    const handleReload = () => {
        if (resetErrorBoundary) {
            resetErrorBoundary();
        }
        else {
            window.location.reload();
        }
    };

    return (
        <Center className={styles.errorBoundary}>
            <Stack className={styles.content}>
                <Title order={1} size="lg">
                    An error occurred
                </Title>
                <ErrorBlock error={error} />
                <Group grow>
                    <Button variant="filled" onClick={handleReload}>
                        Reload
                    </Button>
                </Group>
            </Stack>
        </Center>
    );
}
