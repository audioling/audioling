import type { ServerConnectionFormValues } from '/@/features/authentication/components/server-connection';
import type { FormEventHandler } from 'react';
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
import { SERVER_CONFIG } from '@repo/shared-types/app-types';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Icon } from '/@/components/icon/icon';

export interface SignInFormValues {
    password: string;
    serverAddress: string;
    serverType: string;
    username: string;
}

export function SignInForm() {
    const { t } = useTranslation();
    const { state } = useLocation() as { state: ServerConnectionFormValues };
    const focusTrapRef = useFocusTrap();
    const navigate = useNavigate();

    const form = useForm<SignInFormValues>({
        initialValues: {
            password: '',
            serverAddress: state.serverAddress,
            serverType: state.serverType,
            username: '',
        },
        validate: {
            serverAddress: isNotEmpty(t('common.validation.required')),
            serverType: isNotEmpty(t('common.validation.required')),
            username: isNotEmpty(t('common.validation.required')),
        },
    });

    const handleSubmit = form.onSubmit(() => {
        console.log(form.values);
    }) as FormEventHandler<HTMLFormElement>;

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack ref={focusTrapRef} id="sign-in-form">
                <Group align="center">
                    <ActionIcon size="md" variant="subtle" onClick={() => navigate(-1)}>
                        <Icon icon="arrowLeft" />
                    </ActionIcon>
                    <Title fw="800" order={3}>{t('auth.signIn.signIn')}</Title>
                </Group>
                <Group grow>
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
                                <Image height="80%" src={SERVER_CONFIG[state.serverType].logo} />
                            </AspectRatio>
                        )}
                        value={state.serverAddress}
                        variant="default"

                    />
                </Group>
                <TextInput
                    data-autofocus
                    autoComplete="username"
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
                <Button type="submit" variant="filled">
                    {t('auth.signIn.signIn')}
                </Button>
            </Stack>
        </Box>
    );
}
