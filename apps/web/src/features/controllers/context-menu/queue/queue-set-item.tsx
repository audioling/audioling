import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

export function QueueSetItem() {
    return (
        <>
            <ContextMenu.Submenu disabled>
                <ContextMenu.SubmenuTarget>
                    <ContextMenu.Item leftIcon="star" rightIcon="arrowRightS">
                        Set rating
                    </ContextMenu.Item>
                </ContextMenu.SubmenuTarget>
                <ContextMenu.SubmenuContent>
                    <ContextMenu.Item>1 star</ContextMenu.Item>
                    <ContextMenu.Item>2 stars</ContextMenu.Item>
                    <ContextMenu.Item>3 stars</ContextMenu.Item>
                    <ContextMenu.Item>4 stars</ContextMenu.Item>
                    <ContextMenu.Item>5 stars</ContextMenu.Item>
                </ContextMenu.SubmenuContent>
            </ContextMenu.Submenu>
            <ContextMenu.Item disabled leftIcon="favorite">
                Add to favorites
            </ContextMenu.Item>
            <ContextMenu.Item disabled leftIcon="unfavorite">
                Remove from favorites
            </ContextMenu.Item>
        </>
    );
}
