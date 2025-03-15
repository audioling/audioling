import { ContextMenu } from '/@/components/context-menu/context-menu';

interface RatingContextItemProps {
    onRating?: (rating: number) => void;
}

export function RatingContextItem({ onRating }: RatingContextItemProps) {
    return (
        <ContextMenu.Submenu disabled={!onRating}>
            <ContextMenu.SubmenuTarget>
                <ContextMenu.Item leftIcon="star" rightIcon="arrowRightS">
                    Set rating
                </ContextMenu.Item>
            </ContextMenu.SubmenuTarget>
            <ContextMenu.SubmenuContent>
                <ContextMenu.Item leftIcon="star" onSelect={() => onRating?.(1)}>
                    0
                </ContextMenu.Item>
                <ContextMenu.Item leftIcon="star" onSelect={() => onRating?.(1)}>
                    1
                </ContextMenu.Item>
                <ContextMenu.Item leftIcon="star" onSelect={() => onRating?.(2)}>
                    2
                </ContextMenu.Item>
                <ContextMenu.Item leftIcon="star" onSelect={() => onRating?.(3)}>
                    3
                </ContextMenu.Item>
                <ContextMenu.Item leftIcon="star" onSelect={() => onRating?.(4)}>
                    4
                </ContextMenu.Item>
                <ContextMenu.Item leftIcon="star" onSelect={() => onRating?.(5)}>
                    5
                </ContextMenu.Item>
            </ContextMenu.SubmenuContent>
        </ContextMenu.Submenu>
    );
}
