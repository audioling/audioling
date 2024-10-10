import type { FormEvent } from 'react';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router-dom';
import { usePostAuthRegister } from '@/api/openapi-generated/authentication/authentication.ts';
import { Alert } from '@/features/ui/alert/alert.tsx';
import { Button } from '@/features/ui/button/button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import { PasswordInput } from '@/features/ui/password-input/password-input.tsx';
import { Stack } from '@/features/ui/stack/stack.tsx';
import { TextInput } from '@/features/ui/text-input/text-input.tsx';
import { Title } from '@/features/ui/title/title.tsx';
import { useFocusTrap } from '@/hooks/use-focus-trap.ts';
import { APP_ROUTE } from '@/routes/app-routes.ts';

export const RegistrationForm = (props: { isSetup?: boolean }) => {
    const { isSetup } = props;

    const navigate = useNavigate();
    const { mutate: register } = usePostAuthRegister();

    const { Field, handleSubmit, Subscribe } = useForm({
        defaultValues: {
            password: '',
            username: '',
        },
        onSubmit: (e) => {
            register(
                {
                    data: {
                        password: e.value.password,
                        username: e.value.username,
                    },
                },
                {
                    onError: (error) => {
                        // TODO: handle error
                        console.error(error);
                    },
                    onSuccess: () => {
                        // TODO: Add toast
                        navigate({ pathname: APP_ROUTE.SIGN_IN }, { replace: true });
                    },
                },
            );
        },
    });

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSubmit();
    };

    const ref = useFocusTrap(true);

    return (
        <Stack
            ref={ref}
            as="form"
            justify="center"
            w="320px"
            onSubmit={handleFormSubmit}
        >
            <Group>
                <IconButton
                    icon="arrowLeft"
                    onClick={() => navigate(-1)}
                />
                <Title
                    order={1}
                    size="lg"
                >
                    Sign Up
                </Title>
            </Group>

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
                        autoComplete="new-password"
                        label="Password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                    />
                )}
                name="password"
            />
            <Subscribe
                children={(state) => (
                    <Button
                        disabled={state.isSubmitting}
                        type="submit"
                        variant="filled"
                    >
                        Submit
                    </Button>
                )}
            />
            {isSetup && (
                <Alert
                    message="The server is not set up yet. The account created will be the primary admin user."
                    state="info"
                    title="Create your admin account"
                />
            )}
        </Stack>
    );
};
