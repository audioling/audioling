import { useDndMonitor, useDroppable } from '@dnd-kit/core';

interface SidebarPlaylistItemProps {
    dropId: string;
    name: string;
}

export const SidebarPlaylistItem = (props: SidebarPlaylistItemProps) => {
    const { dropId, name } = props;
    const { isOver, setNodeRef } = useDroppable({
        id: dropId,
    });

    useDndMonitor({
        onDragEnd: (e) => {
            if (dropId !== e.over?.id) return;
        },
    });

    const style = {
        background: isOver ? 'lightgreen' : 'lightgrey',
        color: isOver ? 'green' : 'black',
        padding: '0.5rem 1rem',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
        >
            {name}
        </div>
    );
};
