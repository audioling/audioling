import { Suspense, useEffect, useState } from 'react';
import { Allotment } from 'allotment';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { HeaderBar } from '@/features/navigation/header-bar/header-bar.tsx';
import { NavBarBottom } from '@/features/navigation/nav-bar-bottom/nav-bar-bottom.tsx';
import { NavBarSide } from '@/features/navigation/nav-bar-side/nav-bar-side.tsx';
import { PlayerBar } from '@/features/player/player-bar/player-bar.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import { useIsLargerThanSm } from '@/hooks/use-media-query.ts';
import styles from './dashboard-layout.module.scss';
import 'allotment/dist/style.css';

export function DashboardLayout() {
    const isLargerThanSm = useIsLargerThanSm();

    const [cssVariables, setCssVariables] = useState<Record<string, string>>({
        headerHeight: '',
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

        const headerHeight = getComputedStyle(root).getPropertyValue('--layout-header-height');

        setCssVariables({
            headerHeight,
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
                animate="show"
                exit="hidden"
                id="dashboard-layout"
                initial="hidden"
                style={{ height: '100%', width: '100%' }}
                transition={{ duration: 1 }}
                variants={animationVariants.fadeIn}
            >
                {isLargerThanSm ? (
                    <DesktopLayout
                        headerHeight={cssVariables.headerHeight}
                        playerBarHeight={cssVariables.playerBarHeight}
                    />
                ) : (
                    <MobileLayout navBarBottomHeight={cssVariables.navBarBottomHeight} />
                )}
            </motion.div>
        </AnimatePresence>
    );
}

function DesktopLayout(props: { headerHeight: string; playerBarHeight: string }) {
    const { headerHeight, playerBarHeight } = props;

    const headerHeightNumber = Number(headerHeight.replace('px', ''));
    const playerBarHeightNumber = Number(playerBarHeight.replace('px', ''));

    return (
        <Allotment vertical>
            <Allotment.Pane
                className={styles.headerBarContainer}
                maxSize={headerHeightNumber}
                minSize={headerHeightNumber}
                preferredSize={headerHeightNumber}
            >
                <div className={styles.headerBar} id="header-bar-container">
                    <HeaderBar />
                </div>
            </Allotment.Pane>
            <Allotment>
                <Allotment.Pane
                    className={styles.navBarContainer}
                    maxSize={300}
                    minSize={225}
                    preferredSize={250}
                    snap={true}
                >
                    <div className={styles.navBarSide} id="nav-bar-side-container">
                        <NavBarSide />
                    </div>
                </Allotment.Pane>
                <Allotment.Pane className={styles.contentContainer}>
                    <ScrollArea>
                        <div className={styles.content} id="content-container">
                            <Suspense fallback={<></>}>
                                <Outlet />
                            </Suspense>
                        </div>
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
