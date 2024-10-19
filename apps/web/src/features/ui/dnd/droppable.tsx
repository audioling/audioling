import { useDroppable } from '@dnd-kit/core';

interface DroppableProps extends React.ComponentPropsWithoutRef<'div'> {
    children: React.ReactNode;
    id: string;
}

export const Droppable = (props: DroppableProps) => {
    const { children, id, ...htmlProps } = props;

    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    const style = {
        background: isOver ? 'lightgreen' : 'lightgrey',
        color: isOver ? 'green' : 'black',
        padding: '2rem',
    };

    return (
        <div ref={setNodeRef} style={style} {...htmlProps}>
            {children}
        </div>
    );
};
