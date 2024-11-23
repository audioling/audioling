import { useForm } from 'react-hook-form';
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

    const form = useForm({
        defaultValues: {
            password: '',
            username: '',
        },
    });

    const handleSubmit = form.handleSubmit((data) => {
        register(
            {
                data: {
                    password: data.password,
                    username: data.username,
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
    });

    const ref = useFocusTrap(true);

    return (
        <form onSubmit={handleSubmit}>
            <Stack ref={ref} justify="center" w="320px">
                <Group>
                    <IconButton icon="arrowLeft" onClick={() => navigate(-1)} />
                    <Title order={1} size="lg">
                        Sign Up
                    </Title>
                </Group>
                <TextInput
                    data-autofocus
                    autoComplete="username"
                    label="Username"
                    {...form.register('username', { required: true })}
                />
                <PasswordInput
                    autoComplete="new-password"
                    label="Password"
                    {...form.register('password', { required: true })}
                />
                <Button disabled={form.formState.isSubmitting} type="submit" variant="filled">
                    Submit
                </Button>
                {isSetup && (
                    <Alert
                        message="The server is not set up yet. The account created will be the primary admin user."
                        state="info"
                        title="Create your admin account"
                    />
                )}
            </Stack>
        </form>
    );
};
