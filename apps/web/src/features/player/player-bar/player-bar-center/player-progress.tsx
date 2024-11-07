import type { PointerEvent } from 'react';
import { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import styles from './player-progress.module.scss';

interface PlayerProgressProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
}

export function PlayerProgress(props: PlayerProgressProps) {
    // const classNames = {
    //     bar: styles.bar,
    //     root: styles.root,
    //     thumb: styles.thumb,
    // };
    // return (
    //     <Slider
    //         unstyled
    //         classNames={classNames}
    //         max={duration}
    //         min={0}
    //         value={currentTime}
    //         w="15rem"
    //         onChange={onSeek}
    //     />
    // );

    const controls = useDragControls();

    const handleClickHandle = (event: PointerEvent<HTMLDivElement>) => {
        controls.start(event, { snapToCursor: true });
    };

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            {...props}
            ref={containerRef}
            className={styles.container}
            onPointerDown={handleClickHandle}
        >
            <motion.div
                dragDirectionLock
                className={styles.handle}
                drag="x"
                dragConstraints={containerRef}
                dragControls={controls}
                dragElastic={0}
                dragMomentum={false}
                whileDrag={{ backgroundColor: 'var(--global-primary-color)', scale: 1.5 }}
                whileHover={{ backgroundColor: 'var(--global-primary-color)', scale: 1.5 }}
            />
            <motion.div className={styles.track}></motion.div>
        </motion.div>
    );
}
