import { ContextMenu } from '/@/components/context-menu/context-menu';

export function QueueDownload() {
    return (
        <ContextMenu.Item disabled leftIcon="download">
            Download selected
        </ContextMenu.Item>
    );
}
