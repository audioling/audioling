import { useNavigate } from 'react-router-dom';
import { Group } from '@/features/ui/group/group.tsx';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';
import styles from './nav-bar-header.module.scss';

export const NavBarHeader = () => {
    const navigate = useNavigate();

    return (
        <Group
            className={styles.navBarHeader}
            gap="xs"
            id="nav-bar-header"
        >
            <IconButton
                icon="arrowLeft"
                onClick={() => navigate(-1)}
            />
            <IconButton
                icon="arrowRight"
                onClick={() => navigate(1)}
            />
        </Group>
    );
};
