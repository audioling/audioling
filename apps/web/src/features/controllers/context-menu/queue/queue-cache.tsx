import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function QueueCache() {
    return (
        <ContextMenu.Item disabled leftIcon="cache">
            Cache selected
        </ContextMenu.Item>
    );
}
