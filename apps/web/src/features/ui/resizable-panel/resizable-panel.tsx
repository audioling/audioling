import type { ReactNode } from 'react';
import type { AllotmentProps } from 'allotment';
import { Allotment } from 'allotment';
import styles from './resizable-panel.module.scss';
import 'allotment/dist/style.css';

interface ResizablePanelProps extends AllotmentProps {
    children: ReactNode;
}

export const ResizablePanel = (props: ResizablePanelProps) => {
    const { children, ...restProps } = props;

    return (
        <Allotment className={styles.panel} {...restProps}>
            {children}
        </Allotment>
    );
};

export const Pane = (props: AllotmentProps) => {
    const { children, ...restProps } = props;

    return (
        <Allotment.Pane className={styles.panel} {...restProps}>
            {children}
        </Allotment.Pane>
    );
};

ResizablePanel.Pane = Pane;
