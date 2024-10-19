import { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Allotment } from 'allotment';
import { AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Outlet } from 'react-router-dom';
import { NavBarBottom } from '@/features/navigation/nav-bar-bottom/nav-bar-bottom.tsx';
import { NavBarSide } from '@/features/navigation/nav-bar-side/nav-bar-side.tsx';
import { PlayerBar } from '@/features/player/player-bar/player-bar.tsx';
import { useDnd } from '@/features/ui/dnd/hooks/use-dnd.tsx';
import { EntityTableRowDragOverlay } from '@/features/ui/entity-table/entity-table-row-drag-overlay.tsx';
import { useIsLargerThanSm } from '@/hooks/use-media-query.ts';
import styles from './dashboard-layout.module.scss';
import 'allotment/dist/style.css';

export const DashboardLayout = () => {
    const { dndContextProps } = useDnd({});
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

    return (
        <AnimatePresence>
            <DndContext {...dndContextProps}>
                {isLargerThanSm ? (
                    <DesktopLayout playerBarHeight={cssVariables.playerBarHeight} />
                ) : (
                    <MobileLayout navBarBottomHeight={cssVariables.navBarBottomHeight} />
                )}
                {createPortal(<EntityTableRowDragOverlay />, document.body)}
            </DndContext>
        </AnimatePresence>
    );
};

function DesktopLayout(props: { playerBarHeight: string }) {
    const { playerBarHeight } = props;

    const playerBarHeightNumber = Number(playerBarHeight.replace('px', ''));

    return (
        <Allotment vertical>
            <Allotment>
                <Allotment.Pane
                    className={styles.navBarContainer}
                    maxSize={350}
                    minSize={250}
                    preferredSize={300}
                    snap={true}
                >
                    <div className={styles.navBarSide} id="nav-bar-side-container">
                        <NavBarSide />
                    </div>
                </Allotment.Pane>
                <Allotment.Pane className={styles.contentContainer}>
                    <div className={styles.content} id="content-container">
                        <Outlet />
                    </div>
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
                <div className={styles.content} id="content-container">
                    <Outlet />
                </div>
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
