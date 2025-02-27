import type { FormEventHandler } from 'react';
import { Box, Button, Divider, SegmentedControl, Stack, Text, TextInput, Title } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useFocusTrap } from '@mantine/hooks';
import { SERVER_CONFIG, ServerType } from '@repo/shared-types/app-types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AppRoute } from '/@/routes/types';

const serverOptions = Object.entries(SERVER_CONFIG).map(([key, value]) => ({
    icon: value.logo,
    label: value.name,
    value: key,
}));

export interface ServerConnectionFormValues {
    serverAddress: string;
    serverType: ServerType;
}

export function ServerConnectionForm() {
    const { t } = useTranslation();
    const focusTrapRef = useFocusTrap();
    const navigate = useNavigate();

    const form = useForm<ServerConnectionFormValues>({
        initialValues: {
            serverAddress: 'http://',
            serverType: ServerType.OPENSUBSONIC,
        },
        validate: {
            serverAddress: isNotEmpty(t('common.validation.required')),
            serverType: isNotEmpty(t('common.validation.required')),
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        if (!values.serverAddress || !values.serverType) {
            return;
        }

        navigate(AppRoute.SIGN_IN, { state: values });
    }) as FormEventHandler<HTMLFormElement>;

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack ref={focusTrapRef} id="server-connection-form">
                <Title component="h1" fw="800" order={3}>{t('auth.signIn.connect')}</Title>
                <TextInput
                    data-autofocus
                    aria-label={t('auth.signIn.serverAddress')}
                    placeholder="http://localhost:4533"
                    size="md"
                    variant="filled"
                    {...form.getInputProps('serverAddress')}
                />
                <SegmentedControl
                    aria-label={t('auth.signIn.serverType')}
                    data={serverOptions.map(data => ({
                        label: <ServerIconWithLabel icon={data.icon} label={data.label} />,
                        value: data.value,
                    }))}
                    variant="filled"
                    {...form.getInputProps('serverType')}
                />
                <Button
                    type="submit"
                    variant="filled"
                >
                    {t('common.actions.next')}
                </Button>
                <Divider label="Choose an existing server" />
            </Stack>
        </Box>
    );
}

function ServerIconWithLabel({ icon, label }: { icon: string; label: string }) {
    return (
        <Stack align="center" justify="center">
            <img height="50" src={icon} width="50" />
            <Text>{label}</Text>
        </Stack>
    );
}
