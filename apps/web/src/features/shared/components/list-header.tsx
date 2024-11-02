import type { ReactNode } from 'react';
import styles from './list-header.module.scss';

interface ListHeaderProps {
    children: ReactNode;
}

export function ListHeader(props: ListHeaderProps) {
    const { children } = props;

    return <div className={styles.container}>{children}</div>;
}

interface ListHeaderLeftProps {
    children: ReactNode;
}

function Left(props: ListHeaderLeftProps) {
    const { children } = props;

    return <div className={styles.left}>{children}</div>;
}

interface ListHeaderRightProps {
    children: ReactNode;
}

function Right(props: ListHeaderRightProps) {
    const { children } = props;

    return <div className={styles.right}>{children}</div>;
}

interface ListHeaderTitleProps {
    children: ReactNode;
}

function Title(props: ListHeaderTitleProps) {
    const { children } = props;

    return <div className={styles.title}>{children}</div>;
}

interface ListHeaderFooterProps {
    children: ReactNode;
}

function Footer(props: ListHeaderFooterProps) {
    const { children } = props;

    return <div className={styles.footer}>{children}</div>;
}

ListHeader.Left = Left;
ListHeader.Right = Right;
ListHeader.Title = Title;
ListHeader.Footer = Footer;
