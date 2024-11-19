import {
    useRightPanelOpen,
    useToggleRightPanel,
} from '@/features/navigation/stores/navigation-store.ts';
import { IconButton } from '@/features/ui/icon-button/icon-button.tsx';

export function RightPanelButton() {
    const rightPanelOpen = useRightPanelOpen();
    const toggleRightPanel = useToggleRightPanel();

    return (
        <IconButton
            icon={rightPanelOpen ? 'panelRightClose' : 'panelRightOpen'}
            variant="default"
            onClick={toggleRightPanel}
        />
    );
}
