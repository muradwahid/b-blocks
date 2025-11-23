import { useEffect, useRef } from 'react';

export const useRunJs = (htmlCode, delay = 300) => {
    const timer = useRef();

    useEffect(() => {
        if (!htmlCode) return;
        if (timer.current) clearTimeout(timer.current);

        timer.current = setTimeout(() => {
            const matchedScripts = htmlCode.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gm);
            if (matchedScripts) {
                matchedScripts.forEach((scriptTag) => {
                    // Get content inside <script>...</script>
                    const scriptContentMatch = scriptTag.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
                    if (scriptContentMatch && scriptContentMatch[1]) {
                        // XSS risk! Only use with trusted code!
                        // eslint-disable-next-line no-eval
                        eval(scriptContentMatch[1]);
                    }
                });
            }
        }, delay);

        // Cleanup on unmount/change
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, [htmlCode, delay]);
};
