import { Suspense, useEffect, useState } from 'react';
import clsx from 'clsx';
import type { PanInfo } from 'motion/react';
import { AnimatePresence, motion } from 'motion/react';
import { Outlet } from 'react-router-dom';
import { PlayerController } from '@/features/controllers/player-controller.tsx';
import { PrefetchController } from '@/features/controllers/prefetch-controller.tsx';
import { HeaderBar } from '@/features/navigation/header-bar/header-bar.tsx';
import { NavBarBottom } from '@/features/navigation/nav-bar-bottom/nav-bar-bottom.tsx';
import { NavBarSide } from '@/features/navigation/nav-bar-side/nav-bar-side.tsx';
import {
    useLayout,
    useNavigationStore,
    useSetLayout,
} from '@/features/navigation/stores/navigation-store.ts';
import { SidePlayQueueContainer } from '@/features/player/now-playing/side-play-queue.tsx';
import { PlayerBar } from '@/features/player/player-bar/player-bar.tsx';
import { CreatePlaylistModal } from '@/features/playlists/create-playlist/create-playlist-modal.tsx';
import { CreatePlaylistFolderModal } from '@/features/playlists/create-playlist-folder/create-playlist-folder-modal.tsx';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import { useIsLargerThanSm } from '@/hooks/use-media-query.ts';
import styles from './dashboard-layout.module.scss';

export function DashboardLayout() {
    const isLargerThanSm = useIsLargerThanSm();

    if (isLargerThanSm === undefined) {
        return null;
    }

    return (
        <AnimatePresence mode="sync">
            <CreatePlaylistModal.Root key="create-playlist-modal" />
            <CreatePlaylistFolderModal.Root key="create-playlist-folder-modal" />
            <PlayerController.Root key="player-controller" />
            <PrefetchController.Root key="prefetch-controller" />
            <motion.div
                animate="show"
                exit="hidden"
                id="dashboard-layout"
                initial="hidden"
                transition={{ duration: 1 }}
                variants={animationVariants.fadeIn}
            >
                {isLargerThanSm ? <DesktopLayout /> : <MobileLayout />}
            </motion.div>
        </AnimatePresence>
    );
}

function DesktopLayout() {
    const layout = useLayout();
    const setLayout = useSetLayout();
    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const [isDraggingRight, setIsDraggingRight] = useState(false);

    useEffect(() => {
        const layout = useNavigationStore.getState().layout;

        // Set the initial width of the nav bar and right content
        document.documentElement.style.setProperty(
            '--layout-nav-bar-width',
            `${layout.left.size}px`,
        );

        document.documentElement.style.setProperty(
            '--layout-right-content-width',
            `${layout.right.size}px`,
        );
    }, []);

    const handleDragLeft = (_event: unknown, info: PanInfo) => {
        const style = getComputedStyle(document.documentElement);
        const currentWidth =
            parseFloat(style.getPropertyValue('--layout-nav-bar-width')) || layout.left.size;
        const newWidth = currentWidth + info.delta.x;

        if (newWidth >= 250 && newWidth <= 350) {
            requestAnimationFrame(() => {
                document.documentElement.style.setProperty(
                    '--layout-nav-bar-width',
                    `${newWidth}px`,
                );
            });
        }
    };

    const handleDragLeftEnd = () => {
        const style = getComputedStyle(document.documentElement);
        setLayout({
            left: {
                ...layout.left,
                size: parseFloat(style.getPropertyValue('--layout-nav-bar-width')) || 250,
            },
        });
        setIsDraggingLeft(false);
    };

    const handleDragRight = (_event: unknown, info: PanInfo) => {
        const style = getComputedStyle(document.documentElement);
        const currentWidth =
            parseFloat(style.getPropertyValue('--layout-right-content-width')) || layout.right.size;
        const newWidth = currentWidth - info.delta.x;

        if (newWidth >= 300 && newWidth <= 800) {
            requestAnimationFrame(() => {
                document.documentElement.style.setProperty(
                    '--layout-right-content-width',
                    `${newWidth}px`,
                );
            });
        }
    };

    const handleDragRightEnd = () => {
        const style = getComputedStyle(document.documentElement);
        setLayout({
            right: {
                ...layout.right,
                size: parseFloat(style.getPropertyValue('--layout-right-content-width')) || 300,
            },
        });
        setIsDraggingRight(false);
    };

    // Add this function to compute grid template columns
    const getGridTemplateColumns = () => {
        const leftColumn = layout.left.open ? `var(--layout-nav-bar-width, 300px)` : '80px';
        const rightColumn = layout.right.open ? `var(--layout-right-content-width, 400px)` : '0';
        return `${leftColumn} 1fr ${rightColumn}`;
    };

    return (
        <div className={styles.desktopLayout} id="desktop-layout">
            <div className={styles.headerBarContainer}>
                <div className={styles.headerBar} id="header-bar-container">
                    <HeaderBar />
                </div>
            </div>
            <AnimatePresence initial={false}>
                <motion.div
                    className={styles.contentLayout}
                    id="content-layout"
                    style={{ gridTemplateColumns: getGridTemplateColumns() }}
                >
                    <div className={styles.navBarContainer} id="nav-bar-container">
                        {layout.left.open && (
                            <div className={styles.navBarSide}>
                                <NavBarSide />
                            </div>
                        )}
                        <motion.div
                            className={clsx(styles.dragHandleRight, {
                                [styles.isDraggingLeft]: isDraggingLeft,
                            })}
                            drag="x"
                            dragConstraints={{ bottom: 0, left: 0, right: 0, top: 0 }}
                            dragElastic={0}
                            dragMomentum={false}
                            onDrag={handleDragLeft}
                            onDragEnd={handleDragLeftEnd}
                            onDragStart={() => setIsDraggingLeft(true)}
                        />
                    </div>
                    <div className={styles.contentContainer} id="content-container">
                        <div className={styles.content}>
                            <Suspense fallback={<></>}>
                                <Outlet />
                            </Suspense>
                        </div>
                    </div>
                    {layout.right.open && (
                        <motion.div
                            animate="show"
                            className={styles.rightContentContainer}
                            exit="hidden"
                            id="right-content-container"
                            initial="hidden"
                            variants={animationVariants.fadeInLeft}
                        >
                            <div className={styles.rightContent}>
                                <Suspense fallback={<></>}>
                                    <SidePlayQueueContainer />
                                </Suspense>
                            </div>
                            <motion.div
                                className={clsx(styles.dragHandleLeft, {
                                    [styles.isDraggingRight]: isDraggingRight,
                                })}
                                drag="x"
                                dragConstraints={{ bottom: 0, left: 0, right: 0, top: 0 }}
                                dragElastic={0}
                                dragMomentum={false}
                                onDrag={handleDragRight}
                                onDragEnd={handleDragRightEnd}
                                onDragStart={() => setIsDraggingRight(true)}
                            />
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
            <div className={styles.playerBarContainer} id="player-bar-container">
                <div className={styles.playerBar}>
                    <PlayerBar />
                </div>
            </div>
        </div>
    );
}

function MobileLayout() {
    return (
        <div className={styles.mobileLayout}>
            <ScrollArea className={styles.content} id="content-container">
                <Outlet />
            </ScrollArea>
            <NavBarBottom />
        </div>
    );
}
