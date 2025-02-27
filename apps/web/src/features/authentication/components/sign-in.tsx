import {
    ActionIcon,
    AspectRatio,
    Box,
    Button,
    Group,
    Image,
    PasswordInput,
    Stack,
    TextInput,
    Title,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useFocusTrap } from '@mantine/hooks';
import { SERVER_CONFIG, ServerType } from '@repo/shared-types/app-types';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { Icon } from '/@/components/icon/icon';
import { useSignIn } from '/@/features/authentication/api/sign-in';
import { showToast } from '/@/lib/toast';
import { AppRoute } from '/@/routes/types';

export interface SignInFormValues {
    displayName: string;
    password: string;
    serverAddress: string;
    serverType: string;
    username: string;
}

export function SignInForm() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();

    const focusTrapRef = useFocusTrap();
    const navigate = useNavigate();

    const { isPending, mutate: signIn } = useSignIn(null);

    const serverAddress = searchParams.get('serverAddress') || '';
    const serverType = searchParams.get('serverType') as ServerType || ServerType.OPENSUBSONIC;
    const serverId = searchParams.get('serverId') || null;

    const form = useForm<SignInFormValues>({
        initialValues: {
            displayName: '',
            password: '',
            serverAddress,
            serverType,
            username: '',
        },
        validate: {
            serverAddress: isNotEmpty(t('common.validation.required')),
            serverType: isNotEmpty(t('common.validation.required')),
            username: isNotEmpty(t('common.validation.required')),
        },
    });

    const handleSubmit = form.onSubmit(() => {
        signIn({
            baseUrl: form.values.serverAddress,
            displayName: form.values.displayName,
            password: form.values.password,
            serverType: form.values.serverType as ServerType,
            username: form.values.username,
        });
    });

    const isValidServer = Boolean(serverAddress && serverType in SERVER_CONFIG);

    if (!isValidServer) {
        showToast.error(t('errors.invalidServer'));
        return <Navigate to={AppRoute.INDEX} />;
    }

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack ref={focusTrapRef} id="sign-in-form">
                <Group align="center">
                    <ActionIcon size="md" variant="subtle" onClick={() => navigate(-1)}>
                        <Icon icon="arrowLeft" />
                    </ActionIcon>
                    <Title fw="800" order={3}>{serverId ? t('auth.signIn.signIn') : t('auth.signIn.addServer')}</Title>
                </Group>
                <TextInput
                    disabled
                    label={t('auth.signIn.serverAddress')}
                    rightSection={(
                        <AspectRatio
                            h="100%" ratio={1} style={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Image height="80%" src={SERVER_CONFIG[form.values.serverType as ServerType].logo} />
                        </AspectRatio>
                    )}
                    value={form.values.serverAddress}
                />
                {!serverId && (
                    <TextInput
                        data-autofocus={!serverId}
                        disabled={!!serverId}
                        label={t('auth.signIn.displayName')}
                        value={form.values.displayName}
                        {...form.getInputProps('displayName')}
                    />
                )}
                <TextInput
                    autoComplete="username"
                    data-autofocus={!!serverId}
                    label={t('auth.signIn.username')}
                    spellCheck={false}
                    variant="filled"
                    {...form.getInputProps('username')}
                />
                <PasswordInput
                    autoComplete="current-password"
                    label={t('auth.signIn.password')}
                    variant="filled"
                    {...form.getInputProps('password')}
                />
                <Button loading={isPending} type="submit" variant="filled">
                    {t('auth.signIn.signIn')}
                </Button>
            </Stack>
        </Box>
    );
}
