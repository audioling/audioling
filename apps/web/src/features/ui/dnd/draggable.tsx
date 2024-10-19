import { useDraggable } from '@dnd-kit/core';

interface DraggableProps extends React.ComponentPropsWithoutRef<'div'> {
    children: React.ReactNode;
}

export const Draggable = (props: DraggableProps) => {
    const { children, ...htmlProps } = props;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: 'draggable',
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} {...htmlProps}>
            {children}
        </div>
    );
};
