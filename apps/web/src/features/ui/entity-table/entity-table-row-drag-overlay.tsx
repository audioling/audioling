import { DragOverlay } from '@dnd-kit/core';
import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers';
import { Box } from '@/features/ui/box/box.tsx';

export const EntityTableRowDragOverlay = () => {
    return (
        <DragOverlay
            dropAnimation={null}
            modifiers={[snapCenterToCursor, restrictToWindowEdges]}
            style={{
                background: 'white',
                color: 'black',
                height: '2.5rem',
                opacity: 0.5,
                padding: '0.5rem 1rem',
                width: '10rem',
            }}
        >
            <Box>DRAGGING</Box>
        </DragOverlay>
    );
};
