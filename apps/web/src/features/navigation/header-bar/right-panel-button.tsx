import { useNavigationStore } from '@/features/navigation/stores/navigation-store.ts';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';

export function RightPanelButton() {
    const rightPanelOpen = useNavigationStore.use.layout().right.open;
    const toggleRightPanel = useNavigationStore.use.toggleRightPanel();

    return (
        <IconButton
            icon={rightPanelOpen ? 'panelRightClose' : 'panelRightOpen'}
            variant="default"
            onClick={toggleRightPanel}
        />
    );
}
