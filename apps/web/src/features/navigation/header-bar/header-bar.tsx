import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileMenu } from '@/features/navigation/header-bar/file-menu.tsx';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import styles from './header-bar.module.scss';

export function HeaderBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const [canGoForward, setCanGoForward] = useState(false);
    const canGoBack = location.key !== 'default';

    useEffect(() => {
        setCanGoForward(false);
    }, [location]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoForward = () => {
        navigate(1);
        setCanGoForward(false);
    };

    return (
        <div className={styles.headerBar} id="header-bar">
            <div id="header-bar-left">
                <Group gap="xs">
                    <FileMenu />
                    <IconButton
                        icon="arrowLeftS"
                        isDisabled={!canGoBack}
                        size="lg"
                        variant="default"
                        onClick={handleGoBack}
                    />
                    <IconButton
                        icon="arrowRightS"
                        isDisabled={!canGoForward}
                        size="lg"
                        variant="default"
                        onClick={handleGoForward}
                    />
                </Group>
            </div>
            <div id="header-bar-center"></div>
            <div id="header-bar-right"></div>
        </div>
    );
}
