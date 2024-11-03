import { useMemo } from 'react';
import type {
    GetApiLibraryIdPlaylists200DataItem,
    GetApiLibraryIdPlaylistsFolders200DataItem,
} from '@/api/openapi-generated/audioling-openapi-client.schemas.ts';
import { NavBarPlaylistItem } from '@/features/navigation/nav-bar-side/nav-bar-playlist-item.tsx';
import {
    usePlaylistsNavigationSections,
    useTogglePlaylistsSection,
} from '@/features/navigation/stores/navigation-store.ts';
import { Accordion } from '@/features/ui/accordion/accordion.tsx';
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
    const toggleSection = useTogglePlaylistsSection();

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
        toggleSection(folderId);
    };

    return (
        <TreeNodeList
            libraryId={libraryId}
            nodes={tree}
            openFolders={openedSections}
            onToggleFolder={handleToggleFolder}
        />
    );
}

interface TreeNodeListProps {
    libraryId: string;
    nodes: TreeNode[];
    onToggleFolder: (folderId: string) => void;
    openFolders: Record<string, boolean>;
}

function TreeNodeList({ libraryId, nodes, openFolders, onToggleFolder }: TreeNodeListProps) {
    return (
        <div className={styles.list}>
            {nodes.map((node) => (
                <TreeNodeItem
                    key={node.id}
                    libraryId={libraryId}
                    node={node}
                    openFolders={openFolders}
                    onToggleFolder={onToggleFolder}
                />
            ))}
        </div>
    );
}

interface TreeNodeItemProps {
    libraryId: string;
    node: TreeNode;
    onToggleFolder: (folderId: string) => void;
    openFolders: Record<string, boolean>;
}

function TreeNodeItem({ libraryId, node, openFolders, onToggleFolder }: TreeNodeItemProps) {
    if (node.folder) {
        return (
            <Accordion
                icon="folder"
                label={node.folder.name}
                opened={openFolders[`playlist-${node.folder.id}`]}
                onOpenedChange={() => onToggleFolder(`playlist-${node.folder!.id}`)}
            >
                <div className={styles.nested}>
                    <TreeNodeList
                        libraryId={libraryId}
                        nodes={node.children}
                        openFolders={openFolders}
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
