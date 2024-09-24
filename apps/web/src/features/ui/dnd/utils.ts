import type { CollisionDetection } from '@dnd-kit/core';
import { rectIntersection } from '@dnd-kit/core';

// https://github.com/clauderic/dnd-kit/pull/334#issuecomment-1965708784
export const fixCursorSnapOffset: CollisionDetection = (args) => {
    // Bail out if keyboard activated
    if (!args.pointerCoordinates) {
        return rectIntersection(args);
    }
    const { x, y } = args.pointerCoordinates;
    const { width, height } = args.collisionRect;
    const updated = {
        ...args,
        // The collision rectangle is broken when using snapCenterToCursor. Reset
        // the collision rectangle based on pointer location and overlay size.
        collisionRect: {
            bottom: y + height / 2,
            height,
            left: x - width / 2,
            right: x + width / 2,
            top: y - height / 2,
            width,
        },
    };
    return rectIntersection(updated);
};
