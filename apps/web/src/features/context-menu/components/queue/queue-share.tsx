import { ContextMenu } from '/@/components/context-menu/context-menu';

export function QueueShare() {
    return (
        <ContextMenu.Item disabled leftIcon="share">
            Share
        </ContextMenu.Item>
    );
}
