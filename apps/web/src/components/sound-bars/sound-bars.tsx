import { motion } from 'motion/react';
import { memo } from 'react';

interface SoundBarsProps {
    bpm?: number;
    className?: string;
    isPlaying?: boolean;
}

function SoundBarsBase({ bpm = 120, className = '', isPlaying = true }: SoundBarsProps) {
    const beatDuration = (60 * 2) / bpm;

    const bars = [
        { maxHeight: 12, x: 2 },
        { maxHeight: 16, x: 8 },
        { maxHeight: 20, x: 14 },
        { maxHeight: 14, x: 20 },
    ].map(bar => ({
        ...bar,
        delay: Math.random() * 0.4,
        durationMultiplier: 0.8 + Math.random() * 0.6,
    }));

    return (
        <svg
            className={className}
            fill="currentColor"
            height="24"
            viewBox="0 0 24 24"
            width="24"
        >
            {bars.map(({ delay, durationMultiplier, maxHeight, x }) => (
                <motion.rect
                    key={x}
                    animate={
                        isPlaying
                            ? {
                                    height: [4, maxHeight, 4],
                                    y: [20, 24 - maxHeight, 20],
                                }
                            : {
                                    height: 4,
                                    y: 20,
                                }
                    }
                    initial={{ height: 4, y: 20 }}
                    rx="2"
                    style={{ willChange: 'transform' }}
                    transition={
                        isPlaying
                            ? {
                                    delay: delay * beatDuration,
                                    duration: beatDuration * durationMultiplier,
                                    ease: 'easeInOut',
                                    repeat: Infinity,
                                }
                            : {
                                    duration: 0.2,
                                }
                    }
                    width="4"
                    x={x}
                />
            ))}
        </svg>
    );
}

export const SoundBars = memo(SoundBarsBase);
