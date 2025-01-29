import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface PlayContextItemProps {
    onPlay: () => void;
}

export function PlayNowContextItem({ onPlay }: PlayContextItemProps) {
    return (
        <ContextMenu.Item leftIcon="mediaPlay" onSelect={onPlay}>
            Play
        </ContextMenu.Item>
    );
}

export function PlayNextContextItem({ onPlay }: PlayContextItemProps) {
    return (
        <ContextMenu.Item leftIcon="arrowRightS" onSelect={onPlay}>
            Add next
        </ContextMenu.Item>
    );
}

export function PlayLastContextItem({ onPlay }: PlayContextItemProps) {
    return (
        <ContextMenu.Item leftIcon="arrowRightLast" onSelect={onPlay}>
            Add last
        </ContextMenu.Item>
    );
}
