import { useDebouncedCallback } from '@mantine/hooks';
import { Allotment } from 'allotment';
import { useMemo } from 'react';
import { Outlet } from 'react-router';
import styles from './app-layout.module.css';
import { HeaderBar } from '/@/features/app/components/header-bar/header-bar';
import { LeftSidebar } from '/@/features/app/components/left-sidebar/left-sidebar';
import { PlayerBar } from '/@/features/app/components/player-bar/player-bar';
import { RightSidebar } from '/@/features/app/components/right-sidebar/right-sidebar';
import {
    useMainContentOpenState,
    useMainContentSize,
    useSettingsStore,
} from '/@/stores/settings-store';

export function AppLayout() {
    return (
        <div className={styles.container} id="app-layout">
            <HeaderBar />
            <MainContent />
            <PlayerBar />
        </div>
    );
}

function MainContent() {
    const sizes = useMainContentSize();
    const [isLeftOpen, isRightOpen] = useMainContentOpenState();
    const setSettings = useSettingsStore.use.setState();

    const handleChange = useDebouncedCallback(
        (sizes: number[]) => setSettings(['layout', 'sizes', 'main'], sizes),
        100,
    );

    const layoutSizes = useMemo(() => {
        if (isLeftOpen && isRightOpen) {
            return [sizes[0], sizes[1], sizes[2]];
        }

        if (isLeftOpen) {
            return [sizes[0], sizes[1], 0];
        }

        if (isRightOpen) {
            return [0, sizes[1], sizes[2]];
        }

        return [300, 0, 0];
    }, [isLeftOpen, isRightOpen, sizes]);

    const id = JSON.stringify({ isLeftOpen, isRightOpen });

    return (
        <Allotment
            key={id}
            proportionalLayout
            defaultSizes={layoutSizes}
            id="main-content"
            onChange={handleChange}
        >
            <Allotment.Pane className="left-sidebar-container" maxSize={300} minSize={200}>
                <LeftSidebar />
            </Allotment.Pane>
            <Allotment.Pane className="main-content-container" minSize={0} preferredSize={600}>
                <Outlet />
            </Allotment.Pane>
            <Allotment.Pane className="right-sidebar-container" minSize={200}>
                <RightSidebar />
            </Allotment.Pane>
        </Allotment>
    );
}
