import { useForm } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { usePostAuthSignIn } from '@/api/openapi-generated/authentication/authentication.ts';
import type { AuthenticationFormValues } from '@/features/authentication/components/authentication-form.tsx';
import { useAuthSignIn } from '@/features/authentication/stores/auth-store.ts';
import { Button } from '@/features/ui/button/button.tsx';
import { ButtonLink } from '@/features/ui/button-link.tsx/button-link.tsx';
import { Center } from '@/features/ui/center/center.tsx';
import { Divider } from '@/features/ui/divider/divider.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { Text } from '@/features/ui/text/text.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';

interface AuthenticateServerProps {
    onBack: () => void;
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
                        navigate({ pathname: '/dashboard' }, { replace: true });
                    },
                },
            );
        },
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit();
    };

    return (
        <motion.div
            ref={ref}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Stack
                as="form"
                justify="center"
                w="350px"
                onSubmit={handleFormSubmit}
            >
                <Group>
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
                        <TextInput
                            autoComplete="current-password"
                            label="Password"
                            type="password"
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
                    <ButtonLink to="/register">Create a new account</ButtonLink>
                </Center>
            </Stack>
        </motion.div>
    );
};
