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
        const items = accordionRef.current.querySelectorAll('[data-accordion-item]');

        items.forEach(item => {
            const toggle = item.querySelector('[data-accordion-toggle]');
            const content = item.querySelector('[data-accordion-content]');
            const icon = toggle.querySelector('.accordion-icon');

            if (!toggle || !content) return;

            content.style.maxHeight = '0';

            toggle.addEventListener('click', function () {
                const isOpen = item.classList.contains('is-open');

                if (isOpen) {
                    // Close
                    item.classList.remove('is-open');
                    content.style.maxHeight = '0';
                    toggle.setAttribute('aria-expanded', 'false');
                    if (icon) icon.textContent = '+';
                } else {
                    // Open
                    item.classList.add('is-open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    toggle.setAttribute('aria-expanded', 'true');
                    if (icon) icon.textContent = '−';
                }
            });

            // Handle window resize
            let resizeTimer;
            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    if (item.classList.contains('is-open')) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                }, 250);
            });
        });
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