import { useEffect, useRef, useState } from 'react';
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

const Integration = ({ nonce }) => {

    const [apiData, setApiData] = useState({});
    const [dataKey, setDataKey] = useState('');
    const [revealed, setRevealed] = useState({});
    const [lastAction, setLastAction] = useState({ key: '', type: '' });

    const wasLoading = useRef(false);
    const savedTimer = useRef(null);

    const { data, saveData, isLoading, isError, error } = useWPAjax('bblocks_api_keys', { _wpnonce: nonce }, true);

    // Extra per-integration settings sent along with the key (only used by openAi for now).
    // A saved model that is no longer in the list (e.g. a retired one) falls back to the default
    const openAiModelValue = openAiModel.some((m) => m.value === apiData?.openAi?.model) ? apiData.openAi.model : openAiModel[0].value;
    const extraSettings = (key) => ({ maxToken: apiData[key]?.maxToken ?? '', model: 'openAi' === key ? openAiModelValue : (apiData[key]?.model ?? '') });

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
        setApiData((prev) => ({ ...prev, [key]: { ...prev[key], key: '' } }));
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
    useEffect(() => () => clearTimeout(savedTimer.current), []);
    return (
        <div className='bBlocks-admin-integration-wrapper'>
            <header className='bBlocks-admin-integration-Head'>
                <h2 className='bBlocks-admin-integration-Heading'>API Integrations</h2>
                <p className='bBlocks-admin-integration-Sub'>
                    Connect bBlocks to external services to power features like AI content and social embeds.
                    Your keys are stored in this site&rsquo;s database and are never shared with us.
                </p>
            </header>

            <div className='bBlocks-admin-integration-ApiCartContainer'>
                {apiKeyData.map((item) => {
                    const value = apiData[item.name]?.key ?? '';
                    const hasError = Boolean(error?.[item.name]);
                    const isConnected = Boolean(data?.[item.name]?.key) && !hasError;
                    const saving = isLoading && dataKey === item.name;
                    const isRevealed = Boolean(revealed[item.name]);

                    const statusClass = isConnected ? 'isConnected' : hasError ? 'isError' : 'isIdle';
                    const statusLabel = isConnected ? 'Connected' : hasError ? 'Invalid' : 'Not connected';

                    return (
                        <section key={item.name} className={`bBlocks-admin-integration-ApiCart ${statusClass}`}>
                            <div className='bbCardTop'>
                                <span className='bbCardIcon'>{item.icon}</span>

                                <div className='bbCardTitle'>
                                    <h4>{item.label}</h4>
                                    <span className='bbCardKind'>{item.inputLabel}</span>
                                </div>

                                <span className={`bbStatus ${statusClass}`}>
                                    {isConnected ? <CheckIcon /> : hasError ? <AlertIcon /> : null}
                                    {statusLabel}
                                </span>
                            </div>

                            <div className='bBlocksApiInfo' dangerouslySetInnerHTML={{ __html: item.infoEl }} />

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

                            {
                                item.name === 'openAi' && <div className='bBlocksApiField settingsTokenWrapper'>

                                    <label>{item?.tokenLabel}</label>
                                    <p dangerouslySetInnerHTML={{ __html: item?.tokenDes }}></p>
                                    <NumberControl value={apiData?.[item.name]?.maxToken ?? 1500} onChange={(val) => setApiData({ ...apiData, openAi: { ...apiData?.openAi, maxToken: val } })} onKeyDown={(e) => { if ('Enter' === e.key) handleApiData(item.name); }} />

                                </div>
                            }

                            <div className='bBlocksApiFooter'>
                                <p className='bbStatusLine'>
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
                    );
                })}
            </div>
        </div>
    )
}

export default Integration