// https://github.com/mantinedev/mantine/blob/master/packages/@mantine/hooks/src/use-focus-trap/use-focus-trap.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from 'react';

const TABBABLE_NODES = /input|select|textarea|button|object/;
const FOCUS_SELECTOR = 'a, input, select, textarea, button, object, [tabindex]';

export function useFocusTrap(active = true): (instance: HTMLElement | null) => void {
    const ref = useRef<HTMLElement>(null);

    const focusNode = (node: HTMLElement) => {
        let focusElement: HTMLElement | null = node.querySelector('[data-autofocus]');

        if (!focusElement) {
            const children = Array.from<HTMLElement>(node.querySelectorAll(FOCUS_SELECTOR));
            focusElement = children.find(tabbable) || children.find(focusable) || null;
            if (!focusElement && focusable(node)) {
                focusElement = node;
            }
        }

        if (focusElement) {
            focusElement.focus({ preventScroll: true });
        } else if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn(
                '[@mantine/hooks/use-focus-trap] Failed to find focusable element within provided node',
                node,
            );
        }
    };

    const setRef = useCallback(
        (node: HTMLElement | null) => {
            if (!active) {
                return;
            }

            if (node === null) {
                return;
            }

            if (ref.current === node) {
                return;
            }

            if (node) {
                // Delay processing the HTML node by a frame. This ensures focus is assigned correctly.
                setTimeout(() => {
                    if (node.getRootNode()) {
                        focusNode(node);
                    } else if (process.env.NODE_ENV === 'development') {
                        // eslint-disable-next-line no-console
                        console.warn(
                            '[@mantine/hooks/use-focus-trap] Ref node is not part of the dom',
                            node,
                        );
                    }
                });

                (ref as any).current = node;
            } else {
                (ref as any).current = null;
            }
        },
        [active],
    );

    useEffect(() => {
        if (!active) {
            return undefined;
        }

        ref.current && setTimeout(() => focusNode(ref.current!));

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab' && ref.current) {
                scopeTab(ref.current, event);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [active]);

    return setRef;
}

function scopeTab(node: HTMLElement, event: KeyboardEvent) {
    const tabbable = findTabbableDescendants(node);
    if (!tabbable.length) {
        event.preventDefault();
        return;
    }
    const finalTabbable = tabbable[event.shiftKey ? 0 : tabbable.length - 1];
    const root = node.getRootNode() as unknown as DocumentOrShadowRoot;
    let leavingFinalTabbable = finalTabbable === root.activeElement || node === root.activeElement;

    const activeElement = root.activeElement as Element;
    const activeElementIsRadio =
        activeElement.tagName === 'INPUT' && activeElement.getAttribute('type') === 'radio';
    if (activeElementIsRadio) {
        const activeRadioGroup = tabbable.filter(
            (element) =>
                element.getAttribute('type') === 'radio' &&
                element.getAttribute('name') === activeElement.getAttribute('name'),
        );
        leavingFinalTabbable = activeRadioGroup.includes(finalTabbable);
    }

    if (!leavingFinalTabbable) {
        return;
    }

    event.preventDefault();

    const target = tabbable[event.shiftKey ? tabbable.length - 1 : 0];

    if (target) {
        target.focus();
    }
}

function hidden(element: HTMLElement) {
    if (process.env.NODE_ENV === 'test') {
        return false;
    }

    return element.style.display === 'none';
}

function visible(element: HTMLElement) {
    const isHidden =
        element.getAttribute('aria-hidden') ||
        element.getAttribute('hidden') ||
        element.getAttribute('type') === 'hidden';

    if (isHidden) {
        return false;
    }

    let parentElement: HTMLElement = element;
    while (parentElement) {
        if (parentElement === document.body || parentElement.nodeType === 11) {
            break;
        }

        if (hidden(parentElement)) {
            return false;
        }

        parentElement = parentElement.parentNode as HTMLElement;
    }

    return true;
}

function getElementTabIndex(element: HTMLElement) {
    let tabIndex: string | null | undefined = element.getAttribute('tabindex');
    if (tabIndex === null) {
        tabIndex = undefined;
    }
    return parseInt(tabIndex as string, 10);
}

export function focusable(element: HTMLElement) {
    const nodeName = element.nodeName.toLowerCase();
    const isTabIndexNotNaN = !Number.isNaN(getElementTabIndex(element));
    const res =
        // @ts-expect-error function accepts any html element but if it is a button, it should not be disabled to trigger the condition
        (TABBABLE_NODES.test(nodeName) && !element.disabled) ||
        (element instanceof HTMLAnchorElement
            ? element.href || isTabIndexNotNaN
            : isTabIndexNotNaN);

    return res && visible(element);
}

export function tabbable(element: HTMLElement) {
    const tabIndex = getElementTabIndex(element);
    const isTabIndexNaN = Number.isNaN(tabIndex);
    return (isTabIndexNaN || tabIndex >= 0) && focusable(element);
}

export function findTabbableDescendants(element: HTMLElement): HTMLElement[] {
    return Array.from(element.querySelectorAll<HTMLElement>(FOCUS_SELECTOR)).filter(tabbable);
}
