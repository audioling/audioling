import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface ItemContextMenuProps {}

export const ItemContextMenu = forwardRef<HTMLDivElement, ItemContextMenuProps>((props, ref) => {
    return (
        <ContextMenu>
            <ContextMenu.Target ref={ref}></ContextMenu.Target>
            <ContextMenu.Content></ContextMenu.Content>
        </ContextMenu>
    );
});
