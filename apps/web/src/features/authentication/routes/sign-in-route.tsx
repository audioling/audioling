import { Box, Center } from '@mantine/core';
import { SignInForm } from '/@/features/authentication/components/sign-in';

export function SignInRoute() {
    return (
        <Center
            h="100%"
            id="sign-in-route"
        >
            <Box maw="350px" w="100%">
                <SignInForm />
            </Box>
        </Center>
    );
}
