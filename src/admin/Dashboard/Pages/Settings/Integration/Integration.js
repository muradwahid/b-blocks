import { useEffect, useRef, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { SelectControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { useWPAjax } from '../../../../../../../bpl-tools/hooks';
import { Button } from '../../../../../../../bpl-tools/Components';
import { apiKeyData, openAiModel } from '../../../utils/data2';

import './style.scss';

const KeyIcon = () => (
    <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <circle cx='7.5' cy='15.5' r='4.5' />
        <path d='M10.7 12.3 21 2m-4 0 3 3-3 3' />
    </svg>
);
const EyeIcon = () => (
    <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z' />
        <circle cx='12' cy='12' r='3' />
    </svg>
);
const EyeOffIcon = () => (
    <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
        <line x1='1' y1='1' x2='23' y2='23' />
    </svg>
);
const CheckIcon = () => (
    <svg viewBox='0 0 24 24' width='13' height='13' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='20 6 9 17 4 12' />
    </svg>
);
const AlertIcon = () => (
    <svg viewBox='0 0 24 24' width='13' height='13' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
        <circle cx='12' cy='12' r='10' />
        <line x1='12' y1='8' x2='12' y2='12' />
        <line x1='12' y1='16' x2='12.01' y2='16' />
    </svg>
);
const TrashIcon = () => (
    <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='3 6 5 6 21 6' />
        <path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' />
        <line x1='10' y1='11' x2='10' y2='17' />
        <line x1='14' y1='11' x2='14' y2='17' />
    </svg>
);

const PlugIcon = () => (
    <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4' />
    </svg>
);
const ChevronIcon = () => (
    <svg viewBox='0 0 24 24' width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='6 9 12 15 18 9' />
    </svg>
);

const Integration = ({ nonce }) => {

    const [apiData, setApiData] = useState({});
    const [dataKey, setDataKey] = useState('');
    const [revealed, setRevealed] = useState({});
    const [lastAction, setLastAction] = useState({ key: '', type: '' });
    const [copied, setCopied] = useState('');

    const wasLoading = useRef(false);
    const savedTimer = useRef(null);
    const copiedTimer = useRef(null);

    const { data, saveData, isLoading, isError, error } = useWPAjax('bblocks_api_keys', { _wpnonce: nonce }, true);

    // Extra per-integration settings sent along with the key (only used by openAi for now).
    // A saved model that is no longer in the list (e.g. a retired one) falls back to the default
    const openAiModelValue = openAiModel.some((m) => m.value === apiData?.openAi?.model) ? apiData.openAi.model : openAiModel[0].value;
    // Cloud picker cards carry more than one field (client ID, app ID, secret); they go with the key.
    const extraFields = (key) => Object.fromEntries((apiKeyData.find((i) => i.name === key)?.fields || []).map((f) => [f.name, apiData[key]?.[f.name] ?? '']));
    const extraSettings = (key) => ({ maxToken: apiData[key]?.maxToken ?? '', model: 'openAi' === key ? openAiModelValue : (apiData[key]?.model ?? ''), ...extraFields(key) });

    // Persist a single integration's key.
    // { key: <integration name>, value: <api key string>, maxToken?: <number>, model?: <string> }
    const handleApiData = (key) => {
        if (isLoading || !apiData[key]?.key) return;
        setDataKey(key);
        saveData({ key, value: apiData[key]?.key ?? '', ...extraSettings(key) });
    };

    // Remove/delete an integration's key (keeps other settings like maxToken and model).
    const handleDelete = (key) => {
        if (isLoading) return;
        setApiData((prev) => ({ ...prev, [key]: { ...prev[key], key: '', ...Object.fromEntries((apiKeyData.find((i) => i.name === key)?.fields || []).map((f) => [f.name, ''])) } }));
        setDataKey(key);
        saveData({ key, value: '', ...extraSettings(key) });
    };

    const toggleReveal = (name) => setRevealed((prev) => ({ ...prev, [name]: !prev[name] }));

    // Mirror server-side saved keys into local field state.
    useEffect(() => {
        if (!isLoading && data) {
            setApiData(data);
        }
    }, [isLoading, data, error]);

    // Brief confirmation when a save or delete request resolves without error.
    useEffect(() => {
        if (wasLoading.current && !isLoading && dataKey && !isError) {
            const wasDeleting = !apiData[dataKey]?.key;
            setLastAction({ key: dataKey, type: wasDeleting ? 'deleted' : 'saved' });
            clearTimeout(savedTimer.current);
            savedTimer.current = setTimeout(() => setLastAction({ key: '', type: '' }), 2200);
        }
        wasLoading.current = isLoading;
    }, [isLoading, isError, dataKey, apiData]);
    useEffect(() => () => { clearTimeout(savedTimer.current); clearTimeout(copiedTimer.current); }, []);

    // Each integration is a route: #/settings/integration/<name>. Settings.js redirects anything else to the first one.
    const { section } = useParams();
    const [navOpen, setNavOpen] = useState(true);

    const statusLabels = { isConnected: 'Connected', isError: 'Invalid', isIdle: 'Not connected' };
    const statuses = Object.fromEntries(apiKeyData.map((i) => [i.name, Boolean(data?.[i.name]?.key) && !error?.[i.name] ? 'isConnected' : error?.[i.name] ? 'isError' : 'isIdle']));

    // Skeleton: the real layout classes with placeholder bars, so nothing jumps when the keys arrive.
    if (!data && !isError) {
        return (
            <div className='bBlocksIntegration bBlocksIntegration__skeleton' role='status' aria-busy='true'>
                <span className='screen-reader-text'>Loading integrations…</span>

                <aside className='bBlocksIntegration__sidebar' aria-hidden='true'>
                    <span className='bBlocksIntegration__bone isGroup' />
                    {apiKeyData.map((i) => <span key={i.name} className='bBlocksIntegration__bone isNav' />)}
                </aside>

                <section className='bBlocksIntegration__panel' aria-hidden='true'>
                    <div className='bBlocksIntegration__head'>
                        <span className='bBlocksIntegration__bone isIcon' />
                        <span className='bBlocksIntegration__bone isTitle' />
                    </div>
                    <span className='bBlocksIntegration__bone isGuide' />
                    <span className='bBlocksIntegration__bone isLabel' />
                    <span className='bBlocksIntegration__bone isInput' />
                    <span className='bBlocksIntegration__bone isButton' />
                </section>
            </div>
        );
    }

    const item = apiKeyData.find((i) => i.name === section) || apiKeyData[0];
    const value = apiData[item.name]?.key ?? '';
    const hasError = Boolean(error?.[item.name]);
    const isConnected = 'isConnected' === statuses[item.name];
    const saving = isLoading && dataKey === item.name;
    const isRevealed = Boolean(revealed[item.name]);
    const statusClass = statuses[item.name];

    return (
        <div className='bBlocksIntegration'>
            <aside className='bBlocksIntegration__sidebar'>

                <button type='button' className={`bBlocksIntegration__group${navOpen ? ' isOpen' : ''}`} aria-expanded={navOpen} aria-controls='bBlocksIntegration-nav' onClick={() => setNavOpen(!navOpen)}>
                    <span className='bBlocksIntegration__groupIcon'><PlugIcon /></span>
                    <span className='bBlocksIntegration__groupLabel'>API Integrations</span>
                    <span className='bBlocksIntegration__chevron'><ChevronIcon /></span>
                </button>

                {navOpen && <nav id='bBlocksIntegration-nav' className='bBlocksIntegration__nav' aria-label='Integrations'>
                    {apiKeyData.map((i) => <NavLink key={i.name} to={`/settings/integration/${i.name}`} className='bBlocksIntegration__navItem'>
                        <span className='bBlocksIntegration__navIcon' aria-hidden='true'>{i.icon}</span>
                        <span className='bBlocksIntegration__navLabel'>{i.label}</span>
                        <span className={`bBlocksIntegration__marker ${statuses[i.name]}`} title={statusLabels[statuses[i.name]]}>
                            {'isConnected' === statuses[i.name] ? <CheckIcon /> : 'isError' === statuses[i.name] ? <AlertIcon /> : null}
                            <span className='screen-reader-text'>{statusLabels[statuses[i.name]]}</span>
                        </span>
                    </NavLink>)}
                </nav>}

                <p className='bBlocksIntegration__privacy'>
                    Connect bBlocks to external services to power features like AI content and social embeds.
                    Your keys are stored in this site&rsquo;s database and are never shared with us.
                </p>
            </aside>

            <section id='bBlocksIntegration-panel' className={`bBlocksIntegration__panel ${statusClass}`} aria-labelledby='bBlocksIntegration-title'>
                <header className='bBlocksIntegration__head'>
                    <span className='bBlocksIntegration__icon'>{item.icon}</span>

                    <div className='bBlocksIntegration__titleWrap'>
                        <h2 id='bBlocksIntegration-title' className='bBlocksIntegration__title'>{item.label}</h2>
                        <span className='bBlocksIntegration__kind'>{item.inputLabel}</span>
                    </div>

                    <span className={`bbStatus ${statusClass}`}>
                        {isConnected ? <CheckIcon /> : hasError ? <AlertIcon /> : null}
                        {statusLabels[statusClass]}
                    </span>
                </header>

                <div className='bBlocksIntegration__guide'>
                    <h3 className='bBlocksIntegration__guideTitle'>How to connect</h3>
                    <div className='bBlocksApiInfo' dangerouslySetInnerHTML={{ __html: item.infoEl }} />
                </div>

                <div className='bBlocksIntegration__fields'>
                    {
                        item.name === 'openAi' && <div className='bBlocksApiField settingsTokenWrapper'>

                            <label>Model</label>
                            <p>Select the OpenAI model to use for AI content generation. Different models offer varying capabilities and performance.</p>

                            <SelectControl options={openAiModel} value={openAiModelValue} onChange={(val) => setApiData({ ...apiData, openAi: { ...apiData?.openAi, model: val } })} onKeyDown={(e) => { if ('Enter' === e.key) handleApiData(item.name); }} />

                        </div>
                    }

                    <div className='bBlocksApiField'>
                        <label htmlFor={`bb-api-${item.name}`}>{item.inputLabel}</label>

                        <div className={`bbInputWrap ${hasError ? 'hasError' : ''}`}>
                            <span className='bbInputIcon'><KeyIcon /></span>

                            <input
                                id={`bb-api-${item.name}`}
                                className='bbInput'
                                type={isRevealed ? 'text' : 'password'}
                                value={value}
                                placeholder={`Enter your ${item.label} ${item.inputLabel}`}
                                autoComplete='off'
                                spellCheck={false}
                                onChange={(e) => setApiData({ ...apiData, [item.name]: { ...apiData[item.name], key: e.target.value } })}
                                onKeyDown={(e) => { if ('Enter' === e.key) handleApiData(item.name); }}
                            />

                            {value && (
                                <>
                                    <button
                                        type='button'
                                        className='bbReveal'
                                        aria-pressed={isRevealed}
                                        aria-label={isRevealed ? 'Hide key' : 'Show key'}
                                        onClick={() => toggleReveal(item.name)}
                                        title={isRevealed ? 'Hide' : 'Show'}
                                    >
                                        {isRevealed ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>

                                    <button
                                        type='button'
                                        className='bbDelete'
                                        aria-label={`Remove ${item.label} ${item.inputLabel}`}
                                        onClick={() => handleDelete(item.name)}
                                        title='Remove / Delete'
                                        disabled={saving}
                                    >
                                        <TrashIcon />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {item.fields?.map((field) => <div key={field.name} className='bBlocksApiField'>
                        <label htmlFor={`bb-api-${item.name}-${field.name}`}>{field.label}</label>

                        <div className='bbInputWrap'>
                            <span className='bbInputIcon'><KeyIcon /></span>

                            <input
                                id={`bb-api-${item.name}-${field.name}`}
                                className='bbInput'
                                type={field.secret ? 'password' : 'text'}
                                value={apiData[item.name]?.[field.name] ?? ''}
                                // A saved secret is never sent back: leaving it empty keeps it.
                                placeholder={field.secret && data?.[item.name]?.hasSecret ? 'Saved. Leave empty to keep it.' : (field.placeholder || `Enter your ${item.label} ${field.label}`)}
                                autoComplete='off'
                                spellCheck={false}
                                onChange={(e) => setApiData({ ...apiData, [item.name]: { ...apiData[item.name], [field.name]: e.target.value } })}
                                onKeyDown={(e) => { if ('Enter' === e.key) handleApiData(item.name); }}
                            />
                        </div>
                    </div>)}

                    {item.redirect && <div className='bBlocksApiField'>
                        <label htmlFor={`bb-api-${item.name}-redirect`}>Redirect URI</label>

                        <div className='bbInputWrap'>
                            <input id={`bb-api-${item.name}-redirect`} className='bbInput' type='text' readOnly value={new URL(item.redirect, window.location.href).href} onFocus={(e) => e.target.select()} />

                            <button type='button' className={`bbReveal${copied === item.name ? ' isCopied' : ''}`} title={copied === item.name ? 'Copied' : 'Copy'} aria-label='Copy redirect URI' onClick={() => navigator.clipboard?.writeText(new URL(item.redirect, window.location.href).href).then(() => {
                                setCopied(item.name);
                                clearTimeout(copiedTimer.current);
                                copiedTimer.current = setTimeout(() => setCopied(''), 2000);
                            })}>{copied === item.name ? 'Copied!' : 'Copy'}</button>
                            <span className='screen-reader-text' aria-live='polite'>{copied === item.name ? 'Redirect URI copied' : ''}</span>
                        </div>
                    </div>}

                    {
                        item.name === 'openAi' && <div className='bBlocksApiField settingsTokenWrapper'>

                            <label>{item?.tokenLabel}</label>
                            <p dangerouslySetInnerHTML={{ __html: item?.tokenDes }}></p>
                            <NumberControl value={apiData?.[item.name]?.maxToken ?? 1500} onChange={(val) => setApiData({ ...apiData, openAi: { ...apiData?.openAi, maxToken: val } })} onKeyDown={(e) => { if ('Enter' === e.key) handleApiData(item.name); }} />

                        </div>
                    }
                </div>

                <div className='bBlocksApiFooter'>
                    <p className='bbStatusLine' role='status'>
                        {hasError ? (
                            <span className='bbErr'>{error?.[item.name]?.message || 'Could not validate this key'}</span>
                        ) : lastAction.key === item.name ? (
                            <span className='bbOk'>{lastAction.type === 'deleted' ? 'Removed' : 'Saved'}</span>
                        ) : isConnected ? (
                            <span className='bbOk'>Valid key saved</span>
                        ) : (
                            <span className='bbMuted'>No key saved yet</span>
                        )}
                    </p>

                    <Button
                        className={`bBlocksApiSaveBtn ${!apiData?.[item.name]?.key ? 'isDisabled' : ''}`}
                        type='button'
                        disabled={!apiData?.[item.name]?.key || saving}
                        onClick={() => apiData?.[item.name]?.key && handleApiData(item.name)}
                    >
                        {saving ? 'Saving…' : 'Save'}
                    </Button>
                </div>
            </section>
        </div>
    )
}

export default Integration