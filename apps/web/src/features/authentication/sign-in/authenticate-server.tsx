import type { FormEvent } from 'react';
import { useForm } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import type { Ping } from '@/api/api-types.ts';
import { usePostAuthSignIn } from '@/api/openapi-generated/authentication/authentication.ts';
import type { AuthenticationFormValues } from '@/features/authentication/sign-in/authentication-form.tsx';
import { useAuthSignIn } from '@/features/authentication/stores/auth-store.ts';
import { animationProps } from '@/features/ui/animations/props.ts';
import { Button } from '@/features/ui/button/button.tsx';
import { ButtonLink } from '@/features/ui/button-link.tsx/button-link.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { PasswordInput } from '@/features/ui/password-input/password-input.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

interface AuthenticateServerProps {
    onBack: () => void;
    pingResponse: Ping | null;
    serverUrl: string;
}

export const AuthenticateServer = (props: AuthenticateServerProps) => {
    const ref = useFocusTrap(true);
    const navigate = useNavigate();
    const signInToStore = useAuthSignIn();
    const { mutate } = usePostAuthSignIn();

    const { Field, handleSubmit } = useForm<AuthenticationFormValues>({
        defaultValues: {
            password: '',
            username: '',
        },
        onSubmit: (e) => {
            mutate(
                {
                    data: {
                        password: e.value.password,
                        username: e.value.username,
                    },
                },
                {
                    onSuccess: (response) => {
                        const { data } = response;
                        Cookies.set('token', data.token.token);
                        const cleanUrl = props.serverUrl.replace(/\/$/, '');
                        signInToStore(data, cleanUrl);
                        navigate({ pathname: APP_ROUTE.DASHBOARD }, { replace: true });
                    },
                },
            );
        },
    });

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSubmit();
    };

    return (
        <motion.div
            ref={ref}
            {...animationProps.fadeIn}
        >
            <Stack
                as="form"
                justify="center"
                w="320px"
                onSubmit={handleFormSubmit}
            >
                <Group gap="xs">
                    <IconButton
                        icon="arrowLeft"
                        onClick={props.onBack}
                    />
                    <Title
                        order={1}
                        size="lg"
                    >
                        Sign In
                    </Title>
                </Group>
                <Text
                    isSecondary
                    size="xs"
                >
                    {props.serverUrl}
                </Text>
                <Field
                    children={(field) => (
                        <TextInput
                            data-autofocus
                            autoComplete="username"
                            label="Username"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.currentTarget.value)}
                        />
                    )}
                    name="username"
                />
                <Field
                    children={(field) => (
                        <PasswordInput
                            autoComplete="current-password"
                            label="Password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.currentTarget.value)}
                        />
                    )}
                    name="password"
                />
                <Button
                    uppercase
                    type="submit"
                    variant="filled"
                >
                    Sign In
                </Button>
                <Divider label="Or" />
                <Center>
                    <ButtonLink
                        to="/register"
                        variant="subtle"
                    >
                        Create a new account
                    </ButtonLink>
                </Center>
            </Stack>
        </motion.div>
    );
};
