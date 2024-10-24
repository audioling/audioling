import { useEffect, useState } from 'react';
import { Allotment } from 'allotment';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { HeaderBar } from '@/features/navigation/header-bar/header-bar.tsx';
import { NavBarBottom } from '@/features/navigation/nav-bar-bottom/nav-bar-bottom.tsx';
import { NavBarSide } from '@/features/navigation/nav-bar-side/nav-bar-side.tsx';
import { PlayerBar } from '@/features/player/player-bar/player-bar.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import { useIsLargerThanSm } from '@/hooks/use-media-query.ts';
import styles from './dashboard-layout.module.scss';
import 'allotment/dist/style.css';

export function DashboardLayout() {
    const isLargerThanSm = useIsLargerThanSm();

    const [cssVariables, setCssVariables] = useState<Record<string, string>>({
        navBarBottomHeight: '',
        playerBarHeight: '',
    });

    useEffect(() => {
        const root = document.documentElement;

        const playerBarHeight = getComputedStyle(root).getPropertyValue(
            '--layout-player-bar-height',
        );

        const navBarBottomHeight = getComputedStyle(root).getPropertyValue(
            '--layout-nav-bar-bottom-height',
        );

        setCssVariables({
            navBarBottomHeight,
            playerBarHeight,
        });
    }, []);

    if (isLargerThanSm === undefined) {
        return null;
    }

    return (
        <AnimatePresence mode="sync">
            <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                id="dashboard-layout"
                initial={{ opacity: 0 }}
                style={{ height: '100%', width: '100%' }}
                transition={{ duration: 1 }}
            >
                {isLargerThanSm ? (
                    <DesktopLayout playerBarHeight={cssVariables.playerBarHeight} />
                ) : (
                    <MobileLayout navBarBottomHeight={cssVariables.navBarBottomHeight} />
                )}
            </motion.div>
        </AnimatePresence>
    );
}

function DesktopLayout(props: { playerBarHeight: string }) {
    const { playerBarHeight } = props;

    const playerBarHeightNumber = Number(playerBarHeight.replace('px', ''));

    return (
        <Allotment vertical>
            <Allotment.Pane
                className={styles.headerBarContainer}
                maxSize={40}
                minSize={40}
                preferredSize={40}
            >
                <div className={styles.headerBar} id="header-bar-container">
                    <HeaderBar />
                </div>
            </Allotment.Pane>
            <Allotment>
                <Allotment.Pane
                    className={styles.navBarContainer}
                    maxSize={350}
                    minSize={250}
                    preferredSize={200}
                    snap={true}
                >
                    <div className={styles.navBarSide} id="nav-bar-side-container">
                        <NavBarSide />
                    </div>
                </Allotment.Pane>
                <Allotment.Pane className={styles.contentContainer}>
                    <ScrollArea className={styles.content} id="content-container">
                        <Outlet />
                    </ScrollArea>
                </Allotment.Pane>
            </Allotment>
            <Allotment.Pane
                className={styles.playerBarContainer}
                maxSize={playerBarHeightNumber}
                minSize={playerBarHeightNumber}
                preferredSize={playerBarHeightNumber}
            >
                <div className={styles.playerBar} id="player-bar-container">
                    <PlayerBar />
                </div>
            </Allotment.Pane>
        </Allotment>
    );
}

function MobileLayout(props: { navBarBottomHeight: string }) {
    const { navBarBottomHeight } = props;
    const navBarBottomHeightNumber = Number(navBarBottomHeight.replace('px', ''));

    return (
        <Allotment vertical>
            <Allotment.Pane>
                <ScrollArea className={styles.content} id="content-container">
                    <Outlet />
                </ScrollArea>
            </Allotment.Pane>
            <Allotment.Pane
                maxSize={navBarBottomHeightNumber}
                minSize={navBarBottomHeightNumber}
                preferredSize={navBarBottomHeightNumber}
            >
                <NavBarBottom />
            </Allotment.Pane>
        </Allotment>
    );
}
