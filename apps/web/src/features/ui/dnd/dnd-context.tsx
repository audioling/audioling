import type { PropsWithChildren } from 'react';
import { DndContext as DndKitContext } from '@dnd-kit/core';

interface DndContextProps {}

export const DndContext = (props: PropsWithChildren<DndContextProps>) => {
    const { children } = props;

    return <DndKitContext>{children}</DndKitContext>;
};
