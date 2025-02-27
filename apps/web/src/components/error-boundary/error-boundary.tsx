import { Button, Center, Group, Stack, Text, Title } from '@mantine/core';
import { useRouteError } from 'react-router';
import { ErrorBlock } from '/@/components/error-boundary/error-block';

export function GlobalErrorBoundary() {
    const error = useRouteError();
    console.error('Global error boundary:', error);

    return (
        <Center>
            <Stack gap="md" w="480px">
                <Title order={1} size="lg">
                    An error occurred
                </Title>
                <Text>Please reload the page.</Text>
                <ErrorBlock error={error} />
                <Group grow gap="sm">
                    <Button variant="filled" onClick={() => window.history.back()}>
                        Go back
                    </Button>
                    <Button variant="filled" onClick={() => window.location.reload()}>
                        Reload
                    </Button>
                </Group>
            </Stack>
        </Center>
    );
}
