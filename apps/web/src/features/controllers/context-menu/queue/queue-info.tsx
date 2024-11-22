import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function QueueInfo() {
    return (
        <ContextMenu.Item disabled leftIcon="metadata">
            Info
        </ContextMenu.Item>
    );
}
