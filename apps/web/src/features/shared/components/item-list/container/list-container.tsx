import { ActionIcon, Text as MantineText, Title as MantineTitle } from '@mantine/core';
import { motion, useSpring, useTransform } from 'motion/react';
import { type ReactNode, useEffect, useState } from 'react';
import styles from './list-container.module.css';
import { Icon } from '/@/components/icon/icon';
import { ScrollArea } from '/@/components/scroll-area/scroll-area';
import { MotionText } from '/@/components/text/text';

interface ListContainerProps {
    children: ReactNode;
}

export function ListContainer(props: ListContainerProps) {
    const { children } = props;

    return <div className={styles.container}>{children}</div>;
}

interface HeaderProps {
    children: ReactNode;
}

function Header(props: HeaderProps) {
    const { children } = props;

    return <div className={styles.header}>{children}</div>;
}

interface LeftProps {
    children: ReactNode;
}

function Left(props: LeftProps) {
    const { children } = props;

    return <div className={styles.left}>{children}</div>;
}

interface RightProps {
    children: ReactNode;
}

function Right(props: RightProps) {
    const { children } = props;

    return <div className={styles.right}>{children}</div>;
}

interface TitleProps {
    children: ReactNode;
}

function Title(props: TitleProps) {
    const { children } = props;

    return <MantineTitle className={styles.title} order={1}>{children}</MantineTitle>;
}

interface ItemCountProps {
    loading?: boolean;
    value: number;
}

function ItemCount({ loading, value }: ItemCountProps) {
    const spring = useSpring(value, { damping: 15, mass: 0.8, stiffness: 75 });
    const display = useTransform(spring, current => Math.round(current).toLocaleString());

    const [previousValue, setPreviousValue] = useState(value);

    useEffect(() => {
        if (previousValue !== value && value !== undefined) {
            spring.set(value);
            setPreviousValue(value);
        }
    }, [previousValue, spring, value]);

    if (loading) {
        return <MantineText className={styles.itemCount} variant="secondary">-</MantineText>;
    }

    return <MotionText className={styles.itemCount} variant="secondary">{display}</MotionText>;
}

interface BlockProps {
    children: ReactNode;
}

function Block(props: BlockProps) {
    const { children } = props;

    return <div className={styles.block}>{children}</div>;
}

interface ContentProps {
    children: ReactNode;
}

function Content(props: ContentProps) {
    const { children } = props;

    return <div className={styles.content}>{children}</div>;
}

interface QueryBuilderProps {
    children: ReactNode;
    isOpen: boolean;
}

function QueryBuilder(props: QueryBuilderProps) {
    const { children, isOpen } = props;

    return (
        <motion.div
            animate={{ height: isOpen ? 'auto' : 0 }}
            className={styles.queryBuilder}
            initial={{ height: 0 }}
        >
            <ScrollArea>{children}</ScrollArea>
        </motion.div>
    );
}
interface PlayButtonProps {
    disabled?: boolean;
    isLoading?: boolean;
    onClick: () => void;
}

function PlayButton(props: PlayButtonProps) {
    const { disabled, isLoading, onClick } = props;

    return (
        <ActionIcon
            className={styles.playButton}
            disabled={disabled}
            loading={isLoading}
            variant="primary"
            onClick={onClick}
        >
            <Icon fill="secondary" icon={isLoading ? 'spinner' : 'mediaPlay'} />
        </ActionIcon>
    );
}

ListContainer.Header = Header;
ListContainer.Block = Block;
ListContainer.Left = Left;
ListContainer.Right = Right;
ListContainer.Title = Title;
ListContainer.ItemCount = ItemCount;
ListContainer.Content = Content;
ListContainer.QueryBuilder = QueryBuilder;
ListContainer.PlayButton = PlayButton;
