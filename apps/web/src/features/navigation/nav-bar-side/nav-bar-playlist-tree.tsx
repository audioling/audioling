import { useEffect, useMemo, useRef } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import type {
    GetApiLibraryIdPlaylists200DataItem,
    GetApiLibraryIdPlaylistsFolders200DataItem,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { NavBarPlaylistItem } from '@/features/navigation/nav-bar-side/nav-bar-playlist-item.tsx';
import {
    usePlaylistsNavigationSections,
    useSetSidebarSection,
    useToggleSidebarSection,
} from '@/features/navigation/stores/navigation-store.ts';
import { Accordion } from '@/features/ui/accordion/accordion.tsx';
import type { DragData } from '@/utils/drag-drop.ts';
import { dndUtils, DragTarget } from '@/utils/drag-drop.ts';
import styles from './nav-bar-playlist-tree.module.scss';

interface TreeNode {
    children: TreeNode[];
    folder?: GetApiLibraryIdPlaylistsFolders200DataItem;
    id: string;
    playlist?: GetApiLibraryIdPlaylists200DataItem;
}

interface NavBarPlaylistTreeProps {
    folders: GetApiLibraryIdPlaylistsFolders200DataItem[];
    libraryId: string;
    playlists: GetApiLibraryIdPlaylists200DataItem[];
}

export function NavBarPlaylistTree({ folders, libraryId, playlists }: NavBarPlaylistTreeProps) {
    const openedSections = usePlaylistsNavigationSections();
    const toggleSection = useToggleSidebarSection();
    const setSection = useSetSidebarSection();

    const tree = useMemo(() => {
        const nodes = new Map<string | null, TreeNode[]>();

        // Initialize with empty arrays for each possible parent
        folders.forEach((folder) => {
            nodes.set(folder.id, []);
        });
        nodes.set(null, []); // Root level items

        // Add folders to their parent nodes
        folders.forEach((folder) => {
            const node: TreeNode = {
                children: nodes.get(folder.id) || [],
                folder,
                id: folder.id,
            };

            const parentChildren = nodes.get(folder.parentId) || [];
            parentChildren.push(node);
            nodes.set(folder.parentId, parentChildren);
        });

        // Add playlists to their parent nodes or root if no parent
        playlists.forEach((playlist) => {
            const node: TreeNode = {
                children: [],
                id: playlist.id,
                playlist,
            };

            const parentId = playlist.parentId;
            // If parent exists in our nodes map, add to that parent, otherwise add to root
            if (parentId && nodes.has(parentId)) {
                const parentChildren = nodes.get(parentId) || [];
                parentChildren.push(node);
                nodes.set(parentId, parentChildren);
            } else {
                // Add to root level if no valid parent
                const rootChildren = nodes.get(null) || [];
                rootChildren.push(node);
                nodes.set(null, rootChildren);
            }
        });

        return nodes.get(null) || [];
    }, [folders, playlists]);

    const handleToggleFolder = (folderId: string) => {
        toggleSection('playlists')(folderId);
    };

    const handleSetFolder = (folderId: string, open?: boolean) => {
        setSection('playlists')(folderId, open);
    };

    return (
        <TreeNodeList
            libraryId={libraryId}
            nodes={tree}
            openFolders={openedSections}
            onSetFolder={handleSetFolder}
            onToggleFolder={handleToggleFolder}
        />
    );
}

interface TreeNodeListProps {
    libraryId: string;
    nodes: TreeNode[];
    onSetFolder: (folderId: string, open?: boolean) => void;
    onToggleFolder: (folderId: string) => void;
    openFolders: Record<string, boolean>;
}

function TreeNodeList({
    libraryId,
    nodes,
    openFolders,
    onSetFolder,
    onToggleFolder,
}: TreeNodeListProps) {
    return (
        <div className={styles.list}>
            {nodes.map((node) => (
                <TreeNodeItem
                    key={node.id}
                    libraryId={libraryId}
                    node={node}
                    openFolders={openFolders}
                    onSetFolder={onSetFolder}
                    onToggleFolder={onToggleFolder}
                />
            ))}
        </div>
    );
}

interface TreeNodeItemProps {
    libraryId: string;
    node: TreeNode;
    onSetFolder: (folderId: string, open?: boolean) => void;
    onToggleFolder: (folderId: string) => void;
    openFolders: Record<string, boolean>;
}

function TreeNodeItem({
    libraryId,
    node,
    openFolders,
    onSetFolder,
    onToggleFolder,
}: TreeNodeItemProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!ref.current) return;

        return dropTargetForElements({
            canDrop: (args) => {
                const data = args.source.data as DragData;
                return dndUtils.isDropTarget(data.type, [
                    DragTarget.ALBUM,
                    DragTarget.ALBUM_ARTIST,
                    DragTarget.ARTIST,
                    DragTarget.PLAYLIST,
                    DragTarget.TRACK,
                ]);
            },
            element: ref.current,
            onDragEnter: () => onSetFolder(`playlist-${node.folder?.id}`, true),
            onDragLeave: () => onSetFolder(`playlist-${node.folder?.id}`, false),
            onDrop: () => onSetFolder(`playlist-${node.folder?.id}`, false),
        });
    }, [node.folder?.id, onSetFolder, onToggleFolder, openFolders]);

    if (node.folder) {
        const isOpen = openFolders[`playlist-${node.folder.id}`];

        return (
            <Accordion
                ref={ref}
                icon="folder"
                label={node.folder.name}
                opened={isOpen}
                onOpenedChange={(e) => onSetFolder(`playlist-${node.folder!.id}`, !e)}
            >
                <div className={styles.nested}>
                    <TreeNodeList
                        libraryId={libraryId}
                        nodes={node.children}
                        openFolders={openFolders}
                        onSetFolder={onSetFolder}
                        onToggleFolder={onToggleFolder}
                    />
                </div>
            </Accordion>
        );
    }

    if (node.playlist) {
        return (
            <NavBarPlaylistItem
                libraryId={libraryId}
                name={node.playlist.name}
                playlistId={node.playlist.id}
            />
        );
    }

    return null;
}
