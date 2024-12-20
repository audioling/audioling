import { useNavigate } from 'react-router';
import { CurrentTrackDisplay } from '@/features/navigation/header-bar/current-track-display.tsx';
import { FileMenu } from '@/features/navigation/header-bar/file-menu.tsx';
import { RightPanelButton } from '@/features/navigation/header-bar/right-panel-button.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import styles from './header-bar.module.scss';

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
                    <IconButton icon="arrowLeftS" variant="default" onClick={handleGoBack} />
                    <IconButton icon="arrowRightS" variant="default" onClick={handleGoForward} />
                </Group>
            </div>
            <div className={styles.center} id="header-bar-center">
                <CurrentTrackDisplay />
            </div>
            <div className={styles.right} id="header-bar-right">
                <Group gap="xs" wrap="nowrap">
                    <RightPanelButton />
                    {/* <IconButton icon="remove" variant="default" />
                    <IconButton icon="square" variant="default" />
                    <IconButton icon="x" variant="default" /> */}
                </Group>
            </div>
        </div>
    );
}
