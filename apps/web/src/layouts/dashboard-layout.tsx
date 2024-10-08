import { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Outlet } from 'react-router-dom';
import { Bottom, Fill, LeftResizable, RightResizable, ViewPort } from 'react-spaces';
import { NavBarBottom } from '@/features/navigation/components/nav-bar-bottom.tsx';
import { NavBarHeader } from '@/features/navigation/components/nav-bar-header.tsx';
import { useDnd } from '@/features/ui/dnd/hooks/use-dnd.tsx';
import { EntityTableRowDragOverlay } from '@/features/ui/entity-table/entity-table-row-drag-overlay.tsx';
import { useIsLargerThanSm } from '@/hooks/use-media-query.ts';

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
    const showRightPanel = false;

    return (
        <ViewPort>
            <Fill>
                <LeftResizable
                    id="left-nav-bar-container"
                    size="20%"
                >
                    Left
                </LeftResizable>
                <Fill id="main-content-container">
                    <NavBarHeader />
                    <Outlet />
                </Fill>
                {showRightPanel && (
                    <RightResizable
                        id="right-side-bar-container"
                        size="80%"
                    >
                        Right
                    </RightResizable>
                )}
            </Fill>
            <Bottom
                id="player-bar-container"
                size={playerBarHeight}
            >
                Player Bar
            </Bottom>
        </ViewPort>
    );
}

function MobileLayout(props: { navBarBottomHeight: string }) {
    const { navBarBottomHeight } = props;

    return (
        <ViewPort>
            <Fill>
                <Fill id="main-content-container">
                    <NavBarHeader />
                    <Outlet />
                </Fill>
                <Bottom
                    id="nav-bar-bottom-container"
                    size={navBarBottomHeight}
                >
                    <NavBarBottom />
                </Bottom>
            </Fill>
        </ViewPort>
    );
}
