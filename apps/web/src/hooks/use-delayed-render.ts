import { useEffect, useState, useTransition } from 'react';

export function useDelayedRender(delay: number) {
    const [show, setShow] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const timer = setTimeout(() => {
            startTransition(() => {
                setShow(true);
            });
        }, delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return { isPending, show };
}
