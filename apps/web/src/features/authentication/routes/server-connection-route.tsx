import { Box, Center } from '@mantine/core';
import { ServerConnectionForm } from '/@/features/authentication/components/server-connection';

export function ServerConnectionRoute() {
    return (
        <Center
            h="100%"
            id="server-connection-route"
        >
            <Box maw="350px" w="100%">
                <ServerConnectionForm />
            </Box>
        </Center>
    );
}
