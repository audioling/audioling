import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useMemo, useState } from 'react';
import * as RSelect from '@radix-ui/react-select';
import clsx from 'clsx';
import type { AppIcon } from '@/features/ui/icon/icon.tsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import styles from './select.module.scss';

interface SelectContext {
    align: 'start' | 'center' | 'end';
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    side: 'top' | 'right' | 'bottom' | 'left';
}

export const SelectContext = createContext<SelectContext | null>(null);

interface SelectProps {
    align?: 'start' | 'center' | 'end';
    children: ReactNode;
    onChange: (value: string | null) => void;
    side?: 'top' | 'right' | 'bottom' | 'left';
    value: string;
}

export function Select(props: SelectProps) {
    const { children, align = 'center', side = 'bottom', onChange, value } = props;
    const [open, setOpen] = useState(false);

    const context = useMemo(() => ({ align, open, setOpen, side }), [align, open, side]);

    return (
        <RSelect.Root value={value} onValueChange={onChange}>
            <SelectContext.Provider value={context}>{children}</SelectContext.Provider>
        </RSelect.Root>
    );
}

interface ContentProps {
    children: ReactNode;
}

function Content(props: ContentProps) {
    const { children } = props;

    return (
        <RSelect.Content
            className={styles.content}
            collisionPadding={{ bottom: 4, left: 4, right: 4, top: 4 }}
            position="popper"
            sideOffset={6}
        >
            {children}
        </RSelect.Content>
    );
}

interface ItemProps {
    children: ReactNode;
    disabled?: boolean;
    isSelected?: boolean;
    leftIcon?: keyof typeof AppIcon;
    rightIcon?: keyof typeof AppIcon;
    value: string;
}

function Item(props: ItemProps) {
    const { children, disabled, isSelected, leftIcon, rightIcon, value } = props;

    return (
        <RSelect.Item
            className={clsx(styles.item, {
                [styles.selected]: isSelected,
                [styles.disabled]: disabled,
            })}
            disabled={disabled}
            value={value}
        >
            {leftIcon && <Icon className={styles.leftIcon} icon={leftIcon} />}
            {children}
            {rightIcon && <Icon className={styles.rightIcon} icon={rightIcon} />}
        </RSelect.Item>
    );
}

interface LabelProps {
    children: ReactNode;
}

function Label(props: LabelProps) {
    const { children } = props;

    return <RSelect.Label className={styles.label}>{children}</RSelect.Label>;
}

interface DividerProps {}

function Divider(props: DividerProps) {
    return <RSelect.Separator {...props} className={styles.divider} />;
}

interface TargetProps {
    children: ReactNode;
}

function Target(props: TargetProps) {
    const { children } = props;

    return (
        <RSelect.Trigger asChild className={styles.target}>
            {children}
        </RSelect.Trigger>
    );
}

interface PortalProps {
    children: ReactNode;
}

function Portal(props: PortalProps) {
    const { children } = props;

    return <RSelect.Portal>{children}</RSelect.Portal>;
}

interface ViewportProps {
    children: ReactNode;
}

function Viewport(props: ViewportProps) {
    const { children } = props;

    return <RSelect.Viewport>{children}</RSelect.Viewport>;
}

Select.Content = Content;
Select.Item = Item;
Select.Label = Label;
Select.Divider = Divider;
Select.Target = Target;
Select.Portal = Portal;
Select.Viewport = Viewport;
