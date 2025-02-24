import type { UseFormReturnType } from '@mantine/form';
import type { FormEventHandler } from 'react';
import { ActionIcon, Box, Button, Group, SegmentedControl, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useFocusTrap } from '@mantine/hooks';
import { ServerType } from '@repo/shared-types/app-types';
import { useTranslation } from 'react-i18next';
import JellyfinIcon from '/@/assets/logos/jellyfin.png';
import NavidromeIcon from '/@/assets/logos/navidrome.png';
import SubsonicIcon from '/@/assets/logos/opensubsonic.png';
import { Icon } from '/@/components/icon/icon';

const serverOptions = [
    {
        icon: NavidromeIcon,
        label: 'Navidrome',
        value: ServerType.NAVIDROME,
    },
    {
        icon: JellyfinIcon,
        label: 'Jellyfin',
        value: ServerType.JELLYFIN,
    },
    {
        icon: SubsonicIcon,
        label: 'OpenSubsonic',
        value: ServerType.OPENSUBSONIC,
    },
];

type AuthenticationFormProps = UseFormReturnType<{
    password: string;
    serverAddress: string;
    serverType: string;
    username: string;
}>;

export function SignInFormContent({ setStep, step }: { setStep: (step: number) => void; step: number }) {
    const form = useForm({
        initialValues: {
            password: '',
            serverAddress: 'http://',
            serverType: '',
            username: '',
        },
    });

    return (
        <Box maw="420px" w="100%">
            {step === 0 && <ServerConnectionForm form={form} setStep={setStep} />}
            {step === 1 && <SignInForm form={form} setStep={setStep} />}
        </Box>
    );
}

interface ServerConnectionFormProps {
    form: AuthenticationFormProps;
    setStep: (step: number) => void;
}

function ServerConnectionForm({ form, setStep }: ServerConnectionFormProps) {
    const { t } = useTranslation();
    const focusTrapRef = useFocusTrap();

    return (
        <Stack ref={focusTrapRef} id="server-connection-form">
            <Title component="h1" fw="800" order={3}>{t('auth.signIn.connect')}</Title>
            <TextInput
                data-autofocus
                aria-label={t('auth.signIn.serverAddress')}
                placeholder="http://localhost:4533"
                variant="filled"
                {...form.getInputProps('serverAddress')}
            />
            <SegmentedControl
                aria-label={t('auth.signIn.serverType')}
                data={serverOptions.map(data => ({
                    label: <ServerIconWithLabel icon={data.icon} label={data.label} />,
                    value: data.value,
                }))}
                {...form.getInputProps('serverType')}
            />
            <Button
                type="submit"
                variant="filled"
                onClick={() => setStep(1)}
            >
                Next
            </Button>
        </Stack>
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

interface SignInFormProps {
    form: AuthenticationFormProps;
    setStep: (step: number) => void;
}

function SignInForm({ form, setStep }: SignInFormProps) {
    const { t } = useTranslation();
    const focusTrapRef = useFocusTrap();

    const handleSubmit = form.onSubmit(() => setStep(2)) as FormEventHandler<HTMLFormElement>;
    const handleBack = () => setStep(0);

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack ref={focusTrapRef} id="sign-in-form">
                <Group align="center">
                    <ActionIcon size="lg" variant="subtle" onClick={handleBack}>
                        <Icon icon="arrowLeft" />
                    </ActionIcon>
                    <Title fw="800" order={3}>{t('auth.signIn.signIn')}</Title>
                </Group>
                <TextInput
                    data-autofocus
                    autoComplete="username"
                    placeholder={t('auth.signIn.username')}
                    variant="filled"
                    {...form.getInputProps('username')}
                />
                <TextInput
                    autoComplete="current-password"
                    placeholder={t('auth.signIn.password')}
                    variant="filled"
                    {...form.getInputProps('password')}
                />
                <Button type="submit" variant="filled">
                    {t('common.actions.submit')}
                </Button>
            </Stack>
        </Box>
    );
}
