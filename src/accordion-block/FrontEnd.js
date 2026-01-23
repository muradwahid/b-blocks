import { useEffect, useRef } from 'react';

const FrontEnd = ({ attributes }) => {
    const { items, theme, customStyles } = attributes;
    const accordionRef = useRef(null);

    const getInlineStyles = () => {
        if (theme !== 'custom') return {};

        return {
            '--accordion-header-bg': customStyles.headerBgColor,
            '--accordion-header-text': customStyles.headerTextColor,
            '--accordion-content-bg': customStyles.contentBgColor,
            '--accordion-content-text': customStyles.contentTextColor,
            '--accordion-border-color': customStyles.borderColor,
            '--accordion-border-width': `${customStyles.borderWidth}px`,
            '--accordion-border-radius': `${customStyles.borderRadius}px`,
            '--accordion-header-padding': `${customStyles.headerPadding}px`,
            '--accordion-content-padding': `${customStyles.contentPadding}px`,
            '--accordion-header-font-size': `${customStyles.headerFontSize}px`,
            '--accordion-content-font-size': `${customStyles.contentFontSize}px`,
            '--accordion-icon-color': customStyles.iconColor,
            '--accordion-animation-speed': `${customStyles.animationSpeed}ms`
        };
    };
    
    useEffect(() => {
        const root = accordionRef.current;
        if (!root) return;

        const getItems = () => Array.from(root.querySelectorAll('[data-accordion-item]'));
        const firstItem = getItems()?.[0];
        if (firstItem) firstItem.classList.add('is-open');
        const closeItem = (item) => {
            const toggle = item.querySelector('[data-accordion-toggle]');
            const content = item.querySelector('[data-accordion-content]');
            const icon = toggle?.querySelector('.accordion-icon');

            if (!toggle || !content) return;

            item.classList.remove('is-open');
            content.style.maxHeight = '0';
            toggle.setAttribute('aria-expanded', 'false');
            if (icon) icon.textContent = '+';
        };

        const openItem = (item) => {
            const toggle = item.querySelector('[data-accordion-toggle]');
            const content = item.querySelector('[data-accordion-content]');
            const icon = toggle?.querySelector('.accordion-icon');

            if (!toggle || !content) return;

            item.classList.add('is-open');
            // content.style.maxHeight = content.scrollHeight + 'px';
            content.style.maxHeight = 'unset';
            toggle.setAttribute('aria-expanded', 'true');
            if (icon) icon.textContent = '−';
        };


        getItems().forEach((item) => {
            const content = item.querySelector('[data-accordion-content]');
            if (!content) return;

            if (item.classList.contains('is-open')) {
                // content.style.maxHeight = content.scrollHeight + 'px';
                content.style.maxHeight = 'unset';
            } else {
                content.style.maxHeight = '0';
            }
        });
        const onClick = (e) => {
            const toggle = e.target.closest('[data-accordion-toggle]');
            if (!toggle || !root.contains(toggle)) return;

            const item = toggle.closest('[data-accordion-item]');
            if (!item) return;

            const isOpen = item.classList.contains('is-open');

            if (isOpen) {
                closeItem(item);
                return;
            }

            getItems().forEach((it) => {
                if (it !== item) closeItem(it);
            });
            openItem(item);
        };

        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const open = root.querySelector('[data-accordion-item].is-open');
                if (!open) return;
                const content = open.querySelector('[data-accordion-content]');
                // if (content) content.style.maxHeight = content.scrollHeight + 'px';
                if (content) content.style.maxHeight = 'unset';
            }, 200);
        };

        root.addEventListener('click', onClick);
        window.addEventListener('resize', onResize);

        return () => {
            root.removeEventListener('click', onClick);
            window.removeEventListener('resize', onResize);
            clearTimeout(resizeTimer);
        };
    }, [accordionRef]);


    return <div ref={accordionRef} {...{
        className: `accordion-block accordion-theme-${theme}`,
        style: getInlineStyles()
    }}>
            <div className="accordion-items">
                {items.map((item, index) => (
                    <div key={index} className="accordion-item" data-accordion-item>
                        <button
                            className="accordion-header"
                            data-accordion-toggle
                            type="button"
                            aria-expanded="false"
                        >
                            <span
                                dangerouslySetInnerHTML={{ __html: item.title }}
                                className="accordion-title"
                            />
                            <span className="accordion-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="accordion-content" data-accordion-content>
                            <div className="accordion-text">
                                <div
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    </div>;
};

export default FrontEnd;