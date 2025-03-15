import { ActionIcon, Group } from '@mantine/core';
import { useNavigate } from 'react-router';
import styles from './header-bar.module.css';
import { Icon } from '/@/components/icon/icon';
import { FileMenu } from '/@/features/app/components/header-bar/file-menu';

export function HeaderBar() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoForward = () => {
        navigate(1);
    };

    return (
        <div className={styles.headerBar} id="header-bar">
            <div className={styles.left} id="header-bar-left">
                <Group gap="xs" wrap="nowrap">
                    <FileMenu />
                    <ActionIcon variant="subtle" onClick={handleGoBack}>
                        <Icon icon="arrowLeftS" />
                    </ActionIcon>
                    <ActionIcon variant="subtle" onClick={handleGoForward}>
                        <Icon icon="arrowRightS" />
                    </ActionIcon>
                </Group>
            </div>
            <div className={styles.center} id="header-bar-center">
                {/* <CurrentTrackDisplay /> */}
            </div>
            <div className={styles.right} id="header-bar-right">
                <Group gap="xs" wrap="nowrap">
                    {/* <RightPanelButton /> */}
                    {/* <IconButton icon="remove" variant="default" />
                    <IconButton icon="square" variant="default" />
                    <IconButton icon="x" variant="default" /> */}
                </Group>
            </div>
        </div>
    );
}
