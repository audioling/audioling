import { Button, Divider, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import styles from './server-select.module.css';
import { ScrollArea } from '/@/components/scroll-area/scroll-area';
import { useAuthStore } from '/@/stores/auth-store';

export function ServerSelect() {
    const { t } = useTranslation();
    const servers = useAuthStore.use.servers();

    const handleClick = (serverId: string) => {
        useAuthStore.getState().setSelectedServer(serverId);
    };

    if (Object.keys(servers).length === 0) {
        return null;
    }

    return (
        <>
            <Divider label={t('auth.signIn.chooseExistingServer')} my="lg" />
            <ScrollArea className={styles.serverSelect}>
                <Stack>
                    {Object.values(servers).map(server => (
                        <Button
                            key={server.id}
                            size="sm"
                            variant="default"
                            onClick={() => handleClick(server.id)}
                        >
                            {server.displayName}
                        </Button>
                    ))}
                </Stack>
            </ScrollArea>
        </>

    );
}
