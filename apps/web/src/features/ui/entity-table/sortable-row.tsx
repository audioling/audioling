import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps extends React.ComponentPropsWithoutRef<'div'> {
    children: React.ReactNode;
    id: string;
}

export const SortableRow = (props: SortableRowProps) => {
    const { children, id, ...htmlProps } = props;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            {...htmlProps}
        >
            {children}
        </div>
    );
};
