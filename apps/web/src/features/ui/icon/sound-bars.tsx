import { motion } from 'framer-motion';

interface SoundBarsProps {
    bpm?: number;
    className?: string;
    isPlaying?: boolean;
}

export const SoundBars = ({ className = '', bpm = 120, isPlaying = true }: SoundBarsProps) => {
    const beatDuration = (60 * 2) / bpm;

    const bars = [
        { delay: 0.0, durationMultiplier: 1.0, maxHeight: 12, x: 2 },
        { delay: 0.2, durationMultiplier: 1.2, maxHeight: 16, x: 8 },
        { delay: 0.1, durationMultiplier: 0.9, maxHeight: 20, x: 14 },
        { delay: 0.3, durationMultiplier: 1.1, maxHeight: 14, x: 20 },
    ];

    return (
        <svg className={className} fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
            {bars.map(({ x, maxHeight, delay, durationMultiplier }) => (
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
};
