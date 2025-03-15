import { ContextMenu } from '/@/components/context-menu/context-menu';

export function QueueCache() {
    return (
        <ContextMenu.Item disabled leftIcon="cache">
            Cache selected
        </ContextMenu.Item>
    );
}
