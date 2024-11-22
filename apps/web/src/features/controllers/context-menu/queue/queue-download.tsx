import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function QueueDownload() {
    return (
        <ContextMenu.Item disabled leftIcon="download">
            Download selected
        </ContextMenu.Item>
    );
}
