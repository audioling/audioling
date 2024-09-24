import { DndContext } from '@dnd-kit/core';
import { AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Outlet } from 'react-router';
import { PlayerBar } from '@/features/player/components/player-bar.tsx';
import { SideBar } from '@/features/side-bar/components/side-bar.tsx';
import { Box } from '@/features/ui/box/box';
import { useDnd } from '@/features/ui/dnd/hooks/use-dnd.tsx';
import { EntityTableRowDragOverlay } from '@/features/ui/entity-table/entity-table-row-drag-overlay.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area';
import styles from './app-layout.module.scss';

export const AppLayout = () => {
    const { dndContextProps } = useDnd({});

    return (
        <AnimatePresence>
            <DndContext {...dndContextProps}>
                <Box className={styles.layout}>
                    <Box className={styles.content}>
                        <Box
                            as="aside"
                            className={styles.leftSideBar}
                        >
                            <SideBar />
                        </Box>
                        <ScrollArea
                            as="main"
                            className={styles.main}
                            id="content"
                        >
                            <Outlet />
                        </ScrollArea>
                        <Box className={styles.rightSideBar}> RightSidebar</Box>
                    </Box>

                    <PlayerBar />
                </Box>
                {createPortal(<EntityTableRowDragOverlay />, document.body)}
            </DndContext>
        </AnimatePresence>
    );
};
