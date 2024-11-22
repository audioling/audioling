import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function QueueMove() {
    return (
        <>
            <ContextMenu.Submenu>
                <ContextMenu.SubmenuTarget>
                    <ContextMenu.Item rightIcon="arrowRightS">Move to</ContextMenu.Item>
                </ContextMenu.SubmenuTarget>
                <ContextMenu.SubmenuContent>
                    <ContextMenu.Item leftIcon="arrowRight">Next</ContextMenu.Item>
                    <ContextMenu.Item leftIcon="arrowUpToLine">Top</ContextMenu.Item>
                    <ContextMenu.Item leftIcon="arrowDownToLine">Bottom</ContextMenu.Item>
                </ContextMenu.SubmenuContent>
            </ContextMenu.Submenu>
        </>
    );
}
