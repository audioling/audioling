import { useState } from 'react';
import * as RadixSlider from '@radix-ui/react-slider';
import { motion } from 'motion/react';
import { animationVariants } from '@/features/ui/animations/variants.ts';
import styles from './slider.module.scss';

interface SliderProps {
    defaultValue: number[];
    disabled?: boolean;
    max: number;
    min: number;
    onChange?: (value: number[]) => void;
    onChangeEnd?: (value: number[]) => void;
    orientation: 'horizontal' | 'vertical';
    step?: number;
    value?: number[];
}

export function Slider(props: SliderProps) {
    const { defaultValue, disabled, max, min, onChange, onChangeEnd, orientation, step, value } =
        props;

    const [isHovered, setIsHovered] = useState(false);

    return (
        <RadixSlider.Root
            className={styles.root}
            defaultValue={defaultValue}
            disabled={disabled}
            max={max}
            min={min}
            orientation={orientation}
            step={step}
            value={value}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onValueChange={onChange}
            onValueCommit={onChangeEnd}
        >
            <RadixSlider.Track className={styles.track}>
                <RadixSlider.Range className={styles.range} />
            </RadixSlider.Track>
            <RadixSlider.Thumb asChild>
                {isHovered && (
                    <motion.span
                        animate="show"
                        className={styles.thumb}
                        exit="hidden"
                        initial="hidden"
                        variants={animationVariants.combine(
                            animationVariants.blurIn,
                            animationVariants.fadeIn,
                        )}
                        whileDrag={{ scale: 1.3 }}
                        whileHover={{ scale: 1.3 }}
                    />
                )}
            </RadixSlider.Thumb>
        </RadixSlider.Root>
    );
}
