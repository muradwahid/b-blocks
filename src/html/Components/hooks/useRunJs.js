import { useEffect, useRef } from 'react';

const JS_MIME = /^(?:text|application)\/(?:x-)?(?:java|ecma)script$/i;

const isExecutable = (type) => {
    const value = (type || '').trim();
    return !value || 'module' === value.toLowerCase() || JS_MIME.test(value);
};

/**
 * Re-create the inert <script> tags React injected so the browser runs them.
 *
 * `enabled` is the capability gate, not a convenience switch. Markup that
 * executes is what WordPress puts behind `unfiltered_html`; callers pass the
 * current user's capability in the editor, and the frontend relies on
 * render.php having already run the attribute through wp_kses_post() for
 * authors without it - so by the time the markup reaches the page there is
 * nothing left for this pass to find.
 */
export const useRunJs = (htmlCode, delay = 300, enabled = true) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef?.current;
        if (!enabled || !htmlCode || !container) return;

        const activated = [];

        const timer = setTimeout(() => {
            container?.querySelectorAll('script')?.forEach((inert) => {
                if (!isExecutable(inert.getAttribute('type'))) return;

                const script = document?.createElement('script');
                Array.from(inert?.attributes)?.forEach(({ name, value }) =>
                    script?.setAttribute(name, value)
                );
                if (!inert.src) script.textContent = inert?.textContent;
                inert?.replaceWith(script);
                activated.push(script);
            });
        }, delay);

        return () => {
            clearTimeout(timer);
            activated?.forEach((script) => script?.remove());
        };
    }, [htmlCode, delay, enabled]);

    return containerRef;
};
