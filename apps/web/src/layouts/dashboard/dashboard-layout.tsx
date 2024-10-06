import { DndContext } from '@dnd-kit/core';
import { AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Outlet } from 'react-router';
import { useDnd } from '@/features/ui/dnd/hooks/use-dnd.tsx';
import { EntityTableRowDragOverlay } from '@/features/ui/entity-table/entity-table-row-drag-overlay.tsx';
import { ScrollArea } from '@/features/ui/scroll-area/scroll-area.tsx';
import styles from './dashboard-layout.module.scss';

export const DashboardLayout = () => {
    const { dndContextProps } = useDnd({});

    return (
        <AnimatePresence>
            <DndContext {...dndContextProps}>
                <ScrollArea
                    as="main"
                    className={styles.main}
                    id="content"
                >
                    <Outlet />
                </ScrollArea>

                {createPortal(<EntityTableRowDragOverlay />, document.body)}
            </DndContext>
        </AnimatePresence>
    );
};
