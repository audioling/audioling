import { useNavigate } from 'react-router-dom';
import { FileMenu } from '@/features/navigation/header-bar/file-menu.tsx';
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
                <Group gap="xs">
                    <FileMenu />
                    <IconButton
                        icon="arrowLeftS"
                        size="xl"
                        variant="default"
                        onClick={handleGoBack}
                    />
                    <IconButton
                        icon="arrowRightS"
                        size="xl"
                        variant="default"
                        onClick={handleGoForward}
                    />
                </Group>
            </div>
            <div className={styles.center} id="header-bar-center"></div>
            <div className={styles.right} id="header-bar-right">
                <Group gap="sm" wrap="nowrap">
                    <IconButton icon="panelRightOpen" size="xl" variant="default" />
                </Group>
            </div>
        </div>
    );
}
