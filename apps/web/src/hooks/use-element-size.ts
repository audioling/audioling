// From https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-resize-observer/use-resize-observer.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from 'react';

type ObserverRect = Omit<DOMRectReadOnly, 'toJSON'>;

const defaultState: ObserverRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
};

export function useResizeObserver<T extends HTMLElement = any>(options?: ResizeObserverOptions) {
    const frameID = useRef(0);
    const ref = useRef<T>(null);

    const [rect, setRect] = useState<ObserverRect>(defaultState);

    const observer = useMemo(
        () =>
            typeof window !== 'undefined'
                ? new ResizeObserver((entries: any) => {
                      const entry = entries[0];

                      if (entry) {
                          cancelAnimationFrame(frameID.current);

                          frameID.current = requestAnimationFrame(() => {
                              if (ref.current) {
                                  setRect(entry.contentRect);
                              }
                          });
                      }
                  })
                : null,
        [],
    );

    useEffect(() => {
        if (ref.current) {
            observer?.observe(ref.current, options);
        }

        return () => {
            observer?.disconnect();

            if (frameID.current) {
                cancelAnimationFrame(frameID.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref.current]);

    return [ref, rect] as const;
}

export function useElementSize<T extends HTMLElement = any>(options?: ResizeObserverOptions) {
    const [ref, { width, height }] = useResizeObserver<T>(options);
    return { height, ref, width };
}
