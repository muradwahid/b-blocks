import { useState } from 'react';


const ShortcodeIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={16} height={16} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
    <polyline points='16 18 22 12 16 6' />
    <polyline points='8 6 2 12 8 18' />
</svg>;
const GutenbergIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={16} height={16} fill='currentColor'>
    <path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14H7v-2h4v2zm0-4H7v-2h4v2zm0-4H7V6h4v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V6h4v2z' />
</svg>;
const ElementorIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={16} height={16} fill='currentColor'>
    <path d='M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM8 17H6V7h2v10zm5 0h-2V7h2v10zm5 0h-2V7h2v10z' />
</svg>;
const ThemeIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={16} height={16} fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
    <polyline points='4 17 10 11 4 5' />
    <line x1='12' y1='19' x2='20' y2='19' />
</svg>;

const DEFAULT_TABS = [
    {
        key: 'shortcode',
        label: 'ShortCode',
        icon: ShortcodeIcon,
        steps: [
            { num: 1, title: 'Add a New Item', body: 'Create your saved entry from your plugin\'s admin list — set the source, options, and design.' },
            { num: 2, title: 'Copy the Shortcode', body: 'Each saved entry exposes a shortcode you can copy from the list table.' },
            { num: 3, title: 'Paste It Anywhere', body: 'Drop the shortcode into any post, page, widget area, or theme template to render it.' }
        ]
    },
    {
        key: 'gutenberg',
        label: 'Gutenberg',
        icon: GutenbergIcon,
        steps: [
            { num: 1, title: 'Open the Block Editor', body: 'Edit any post or page where you want this plugin\'s output to appear.' },
            { num: 2, title: 'Insert the Block', body: 'Click + (Add block), search for the plugin\'s block, and insert it.' },
            { num: 3, title: 'Configure Inline', body: 'Tune options from the sidebar — every change previews live.' }
        ]
    }
];

/**
 * Admin2 GettingStartedTabs
 *
 * Tabbed "how to use the plugin" panel. Each tab renders a 3-step walkthrough
 * with optional inline action links. The tab set is fully data-driven so each
 * plugin ships its own (ShortCode / Gutenberg / Elementor / WooCommerce / etc.).
 *
 * @param {object} props
 * @param {object}   [props.pages]   - { docs } URL used for the "Read the Full Documentation" CTA.
 * @param {string}   [props.docsUrl] - Fallback docs URL if pages.docs is absent.
 * @param {string}   [props.title='Getting Started']
 * @param {string}   [props.subtitle="Pick how you'd like to embed your output — the steps below adapt to your editor."]
 * @param {Array}    [props.tabs]    - Array of { key, label, icon, steps:[{ num, title, body, link?:{ url, label } }] }.
 *                                     Step `body` is rendered with dangerouslySetInnerHTML so it can include inline <code>.
 * @returns {JSX.Element}
 */
const GettingStartedTabs = ({
    pages,
    docsUrl,
    title = 'Getting Started',
    subtitle = "Pick how you'd like to embed your output — the steps below adapt to your editor.",
    tabs = DEFAULT_TABS
}) => {
    const [active, setActive] = useState(0);
    const resolvedDocs = pages?.docs || docsUrl || 'https://bplugins.com/';

    if (!tabs?.length) return null;

    return <div className='bp3dGettingStarted bp3dGsTabbed bPlDashboardCard'>
        <div className='bp3dGsHeader'>
            <h2>{title}</h2>
            <p>{subtitle}</p>
        </div>

        <div className='bp3dGsTabsNav' role='tablist'>
            {tabs.map((tab, index) => (
                <button
                    key={tab.key || index}
                    type='button'
                    role='tab'
                    aria-selected={active === index}
                    className={`bp3dGsTab ${active === index ? 'isActive' : ''}`}
                    onClick={() => setActive(index)}
                >
                    <span className='bp3dGsTabIcon'>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>

        <div className='bp3dGsTabsViewport'>
            <div className='bp3dGsTabsTrack' style={{ transform: `translateX(-${active * 100}%)` }}>
                {tabs.map((tab, tIdx) => (
                    <div key={tab.key || tIdx} className='bp3dGsTabPanel' role='tabpanel' aria-hidden={active !== tIdx}>
                        <div className='bp3dGsSteps'>
                            {tab.steps?.map((step, sIdx) => (
                                <div key={step.num || sIdx} className='bp3dGsStep'>
                                    <span className='bp3dGsStepNum'>{step.num || sIdx + 1}</span>

                                    <div className='bp3dGsStepBody'>
                                        <h3>{step.title}</h3>
                                        <p dangerouslySetInnerHTML={{ __html: step.body }} />
                                        {step.link && <a className='bp3dGsLink' href={step.link.url}>{step.link.label} →</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className='bp3dGsDocs'>
            <div>
                <h3>Read the Full Documentation</h3>
                <p>Browse guides, settings reference, and examples for every feature.</p>
            </div>

            <a className='bp3dGsDocsBtn' href={resolvedDocs} target='_blank' rel='noopener noreferrer'>Open Documentation →</a>
        </div>
    </div>;
};

// Expose the pre-built tab icons so consumers can build their own tabs array
// without re-implementing inline SVGs.
export const gsIcons = {
    shortcode: ShortcodeIcon,
    gutenberg: GutenbergIcon,
    elementor: ElementorIcon,
    theme: ThemeIcon
};

export default GettingStartedTabs;
