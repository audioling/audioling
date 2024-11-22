import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function QueueShare() {
    return (
        <ContextMenu.Item disabled leftIcon="share">
            Share
        </ContextMenu.Item>
    );
}
