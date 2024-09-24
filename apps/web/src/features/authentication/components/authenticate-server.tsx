import { useForm } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useAuthServicePostAuthSignIn } from '@/api/queries/queries.ts';
import type { AuthenticationFormValues } from '@/features/authentication/components/authentication-form.tsx';
import { Button } from '@/features/ui/button/button';
import { Divider } from '@/features/ui/divider/divider';
import { Group } from '@/features/ui/group/group';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { Stack } from '@/features/ui/stack/stack';
import { Text } from '@/features/ui/text/text';
import { TextInput } from '@/features/ui/text-input/text-input';
import { Title } from '@/features/ui/title/title';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';
import { useAuthSignIn } from '@/store/auth-store.ts';

interface AuthenticateServerProps {
    onBack: () => void;
    serverUrl: string;
}

export const AuthenticateServer = (props: AuthenticateServerProps) => {
    const ref = useFocusTrap(true);
    const signInToStore = useAuthSignIn();
    const { mutate } = useAuthServicePostAuthSignIn();

    const { Field, handleSubmit } = useForm<AuthenticationFormValues>({
        defaultValues: {
            password: '',
            username: '',
        },
        onSubmit: (e) => {
            mutate(
                {
                    requestBody: {
                        password: e.value.password,
                        username: e.value.username,
                    },
                },
                {
                    onSuccess: (res) => {
                        Cookies.set('token', res.data.token);
                        Cookies.set('refreshToken', res.data.refreshToken);
                        signInToStore(res);
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
                        size="md"
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
                <Button variant="default">Create a new account</Button>
            </Stack>
        </motion.div>
    );
};
