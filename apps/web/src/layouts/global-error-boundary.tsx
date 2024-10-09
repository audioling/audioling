import { isAxiosError } from 'axios';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@/features/ui/button/button.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { Title } from '@/features/ui/title/title.tsx';

export const GlobalErrorBoundary = () => {
    const error = useRouteError();

    console.error('Global error boundary:', error);

    if (isRouteErrorResponse(error) && error.status === 401) {
        return (
            <Center>
                <Stack>
                    <Title order={1}>Error</Title>
                    <Text>{error.status}</Text>
                    <Text>{error.data.sorry}</Text>
                    <Button onClick={() => window.location.reload()}>Reload</Button>
                </Stack>
            </Center>
        );
    }

    if (isAxiosError(error)) {
        return (
            <Center>
                <Stack>
                    <Title order={1}>Error</Title>
                    <Text>{error.message}</Text>
                    <Text>{error.response?.data.message}</Text>
                    <Button onClick={() => window.location.reload()}>Reload</Button>
                </Stack>
            </Center>
        );
    }

    return (
        <Center>
            <Stack gap="xs">
                <Title order={1}>An error occurred</Title>
                <Text>Please reload the page.</Text>
                <Button onClick={() => window.location.reload()}>Reload</Button>
            </Stack>
        </Center>
    );
};
