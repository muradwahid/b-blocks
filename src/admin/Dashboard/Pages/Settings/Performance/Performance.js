import { useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import { Button, Notice } from '@wordpress/components';
import { useWPAjax } from '../../../../../../../bpl-tools/hooks';

import Caching from './Caching';
import Images from './Images';
import Assets from './Assets';
import Fonts from './Fonts';
import Platform from './Platform';

import './style.scss';

const TrendIcon = () => (
    <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <rect x='2.5' y='2.5' width='19' height='19' rx='4' />
        <polyline points='6 15 10 11 13 14 18 8' />
    </svg>
);

const ChevronIcon = () => (
    <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='6 9 12 15 18 9' />
    </svg>
);

const BoltIcon = () => (
    <svg viewBox='0 0 24 24' width='20' height='20' fill='#f59e0b' stroke='#f59e0b' strokeWidth='1.5' strokeLinejoin='round'>
        <polygon points='13 2 4 14 11 14 10 22 19 10 12 10 13 2' />
    </svg>
);

// Each sub-tab is a route: #/settings/performance/<id>. Settings.js redirects anything else to caching.
export const tabs = [
    { id: 'caching', label: __('Caching', 'b-blocks') },
    { id: 'images', label: __('Images', 'b-blocks') },
    { id: 'assets', label: __('Assets', 'b-blocks') },
    { id: 'fonts', label: __('Fonts', 'b-blocks') },
    { id: 'platform', label: __('Platform', 'b-blocks') }
];

// The ★ set "Apply recommended settings" switches to: the same switches and compression as defaults() in
// includes/Performance.php (keep the two in step). Text and number fields are left as they are.
const recommended = {
    caching: { fullPage: true, rebuildOnSave: false, compressed: true, separateMobile: true, background: true, inlineCssFiles: true, headerFooter: true, templateLookups: true },
    images: { lazyLoad: true, dimensions: true, srcset: true, preloadLcp: true, compression: '5', webp: true, optimizeUploads: true, requireFilenames: true, requireAlt: true },
    assets: { assetFiles: true, criticalCss: true, asyncCss: true, combineCss: true, cssPerBlock: true, deferScripts: true, delayJs: true, minifyInline: true, removeQuery: true },
    fonts: { fontSwap: true, preloadFonts: true, hostLocal: true, disableGoogle: false, usedWeights: true },
    platform: { disableEmojis: true, disableEmbeds: true, disableDashicons: true, removeJqueryMigrate: true, heartbeat: true, touchTargets: true },
};

const Performance = ({ nonce }) => {
    // Settings, cache numbers and object-cache status all come from includes/Performance.php.
    const { data, saveData, isLoading, isError, error } = useWPAjax('bblocks_performance', { _wpnonce: nonce, do: 'get' }, true);

    const [saved, setSaved] = useState(null);
    const [settings, setSettings] = useState(null);
    const [stats, setStats] = useState({ pages: 0, bytes: '0.00 B', sheets: 0 });
    const [objectCache, setObjectCache] = useState(false);
    const [status, setStatus] = useState({});
    const [action, setAction] = useState('get');
    const { section: tab } = useParams();
    const [navOpen, setNavOpen] = useState(true);
    const [showBanner, setShowBanner] = useState(true);
    const [justSaved, setJustSaved] = useState(false);

    const savedTimer = useRef(null);
    const sentRef = useRef(null);
    useEffect(() => () => clearTimeout(savedTimer.current), []);

    useEffect(() => {
        if (!data) return;
        setStats(data.stats);
        setObjectCache(data.objectCache);
        setStatus(data.status || {});
        // A purge only refreshes the numbers, so unsaved edits stay put.
        if ('purge' !== action) {
            setSaved(data.settings);
            // Edits made while the save was in flight stay (and stay unsaved); otherwise take the server's copy.
            setSettings((prev) => ('save' === action && prev && JSON.stringify(prev) !== sentRef.current ? prev : data.settings));
        }
        if ('save' === action) {
            setJustSaved(true);
            clearTimeout(savedTimer.current);
            savedTimer.current = setTimeout(() => setJustSaved(false), 2000);
        }
    }, [data]);

    const saving = isLoading && 'save' === action;
    const purging = isLoading && 'purge' === action;

    // One setter for every control on the page — otherwise the same nested spread would be repeated ~50 times.
    const set = (group, key, value) => setSettings((prev) => ({ ...prev, [group]: { ...prev[group], [key]: value } }));

    const onSave = () => {
        setAction('save');
        sentRef.current = JSON.stringify(settings);
        saveData({ do: 'save', settings: sentRef.current });
    };

    const onPurge = () => {
        setAction('purge');
        saveData({ do: 'purge' });
    };

    const onApplyRecommended = () => setSettings((prev) => ({
        caching: { ...prev.caching, ...recommended.caching },
        images: { ...prev.images, ...recommended.images },
        assets: { ...prev.assets, ...recommended.assets },
        fonts: { ...prev.fonts, ...recommended.fonts },
        platform: { ...prev.platform, ...recommended.platform },
    }));

    if (!settings && isError) {
        return (
            <div className='bBlocksPerformance__loading'>
                <Notice status='error' isDismissible={false}>{error?.message || __('Could not load the performance settings.', 'b-blocks')}</Notice>
            </div>
        );
    }

    // Skeleton: the real layout classes with placeholder bars, so nothing jumps when the settings arrive.
    if (!settings) {
        return (
            <div className='bBlocksPerformance bBlocksPerformance__skeleton' role='status' aria-busy='true'>
                <span className='screen-reader-text'>{__('Loading performance settings…', 'b-blocks')}</span>

                <aside className='bBlocksPerformance__sidebar' aria-hidden='true'>
                    <span className='bBlocksPerformance__bone isGroup' />
                    {tabs.map((t) => <span key={t.id} className='bBlocksPerformance__bone isNav' />)}
                </aside>

                <section className='bBlocksPerformance__panel' aria-hidden='true'>
                    <span className='bBlocksPerformance__bone isTitle' />
                    <span className='bBlocksPerformance__bone isBanner' />
                    <div className='bBlocksPerformance__rows'>
                        <span className='bBlocksPerformance__bone isStatus' />
                        {[0, 1, 2, 3, 4].map((n) => (
                            <div key={n} className={`bBlocksPerformance__row${n % 2 ? '' : ' isToggleRow'}`}>
                                <div className='bBlocksPerformance__rowText'>
                                    <span className='bBlocksPerformance__bone isLabel' />
                                    <span className='bBlocksPerformance__bone isLine' />
                                    <span className='bBlocksPerformance__bone isLine isShort' />
                                </div>
                                {n % 2 ? <span className='bBlocksPerformance__bone isInput' /> : <span className='bBlocksPerformance__bone isToggle' />}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    const { caching, images, assets, fonts, platform } = settings;
    const isDirty = JSON.stringify(settings) !== JSON.stringify(saved);
    // Every recommended value already set (applied now, or saved earlier): the banner has nothing left to offer.
    const hasRecommended = Object.keys(recommended).every((group) => Object.keys(recommended[group]).every((key) => settings[group][key] === recommended[group][key]));

    return <div className='bBlocksPerformance'>
        <aside className='bBlocksPerformance__sidebar'>

            <button type='button' className={`bBlocksPerformance__group${navOpen ? ' isOpen' : ''}`} aria-expanded={navOpen} aria-controls='bBlocksPerformance-nav' onClick={() => setNavOpen(!navOpen)}>
                <span className='bBlocksPerformance__groupIcon'><TrendIcon /></span>
                <span className='bBlocksPerformance__groupLabel'>{__('Performance', 'b-blocks')}</span>
                <span className='bBlocksPerformance__chevron'><ChevronIcon /></span>
            </button>

            {navOpen && <nav id='bBlocksPerformance-nav' className='bBlocksPerformance__nav' aria-label={__('Performance sections', 'b-blocks')}>
                {tabs.map((t) => <NavLink key={t.id} to={`/settings/performance/${t.id}`} className='bBlocksPerformance__navItem'>{t.label}</NavLink>)}
            </nav>}

        </aside>

        <section id='bBlocksPerformance-panel' className='bBlocksPerformance__panel' aria-labelledby='bBlocksPerformance-title'>
            <h2 id='bBlocksPerformance-title' className='bBlocksPerformance__title'>{tabs.find((t) => t.id === tab).label}</h2>

            {showBanner && !hasRecommended && (
                <div className='bBlocksPerformance__banner'>
                    <span className='bBlocksPerformance__bannerIcon'><BoltIcon /></span>
                    <div className='bBlocksPerformance__bannerText'>
                        <strong>{__('Boost your page speed', 'b-blocks')}</strong>
                        <p>{__('Once your website is complete, we recommend turning on a set of speed optimizations — combine & inline block CSS, defer scripts, lazy-load images, and remove WordPress bloat. Apply them in one click.', 'b-blocks')}</p>
                    </div>
                    <div className='bBlocksPerformance__bannerActions'>
                        <Button variant='primary' className='bBlocksPerformance__applyBtn' onClick={onApplyRecommended}>{__('Apply recommended settings', 'b-blocks')}</Button>
                        <Button variant='tertiary' onClick={() => setShowBanner(false)}>{__('Not now', 'b-blocks')}</Button>
                    </div>
                </div>
            )}

            {tab === 'caching' && <Caching caching={caching} set={set} stats={stats} purging={purging} onPurge={onPurge} objectCache={objectCache} status={status} />}

            {tab === 'images' && <Images images={images} set={set} />}

            {tab === 'assets' && <Assets assets={assets} set={set} status={status} />}

            {tab === 'fonts' && <Fonts fonts={fonts} set={set} />}

            {tab === 'platform' && <Platform platform={platform} set={set} />}

            {(isDirty || justSaved) && (
                <div className='bBlocksPerformance__savebar'>
                    {isDirty ? <>
                        <span className={`bBlocksPerformance__savebarText${isError && 'save' === action && !saving ? ' isError' : ''}`}>
                            {isError && 'save' === action && !saving ? (error?.message || __('Could not save — try again.', 'b-blocks')) : __('Unsaved changes', 'b-blocks')}
                        </span>
                        <div className='bBlocksPerformance__savebarActions'>
                            <Button variant='tertiary' disabled={saving} onClick={() => setSettings(saved)}>{__('Reset', 'b-blocks')}</Button>
                            <Button variant='primary' isBusy={saving} disabled={saving} onClick={onSave}>{saving ? __('Saving…', 'b-blocks') : __('Save changes', 'b-blocks')}</Button>
                        </div>
                    </> : <Notice status='success' isDismissible={false}>{__('Settings saved.', 'b-blocks')}</Notice>
                    }
                </div>
            )}
        </section>
    </div>
};

export default Performance;