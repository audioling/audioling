import { ContextMenu } from '@/features/ui/context-menu/context-menu.tsx';

interface FavoritesContextItemProps {
    onFavorite?: () => void;
    onUnfavorite?: () => void;
}

export function FavoritesContextItem({ onFavorite, onUnfavorite }: FavoritesContextItemProps) {
    return (
        <>
            <ContextMenu.Item disabled={!onFavorite} leftIcon="favorite" onSelect={onFavorite}>
                Add to favorites
            </ContextMenu.Item>
            <ContextMenu.Item
                disabled={!onUnfavorite}
                leftIcon="unfavorite"
                onSelect={onUnfavorite}
            >
                Remove from favorites
            </ContextMenu.Item>
        </>
    );
}
