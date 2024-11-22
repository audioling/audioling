import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function QueueRemove() {
    const handle = () => {};

    return <ContextMenu.Item onSelect={handle}>Remove selected</ContextMenu.Item>;
}
