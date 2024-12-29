import clsx from 'clsx';
import { Icon } from '@/features/ui/icon/icon.tsx';
import styles from './spinner.module.scss';

interface SpinnerProps {
    className?: string;
    height?: string;
    width?: string;
}

export function Spinner({ className, height, width }: SpinnerProps) {
    return (
        <div className={clsx(styles.spinner, className)} style={{ height, width }}>
            <Icon icon="spinner" size="lg" />
        </div>
    );
}
