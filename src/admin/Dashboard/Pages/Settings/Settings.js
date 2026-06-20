import { useEffect, useRef, useState } from 'react';

import { Button } from '../../../../../../bpl-tools/Components';
import { useWPAjax } from '../../../../../../bpl-tools/hooks';

import { apiKeyData } from '../../utils/data2';

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

const Settings = ({ info }) => {
	const { nonce } = info;

	const [apiData, setApiData] = useState({});
	const [dataKey, setDataKey] = useState('');
	const [revealed, setRevealed] = useState({});
	const [savedKey, setSavedKey] = useState('');

	const wasLoading = useRef(false);
	const savedTimer = useRef(null);

	const { data, saveData, isLoading, isError, error } = useWPAjax('bblocks_api_keys', { _wpnonce: nonce }, true);

	// Persist a single integration's key. Contract is unchanged from the
	// previous version: { key: <integration name>, value: <api key string> }.
	const handleApiData = (key) => {
		if (isLoading) return;
		setDataKey(key);
		saveData({ key, value: apiData[key]?.key ?? '' });
	};

	const toggleReveal = (name) => setRevealed((prev) => ({ ...prev, [name]: !prev[name] }));

	// Mirror server-side saved keys into local field state.
	useEffect(() => {
		if (!isLoading && data) {
			setApiData(data);
		}
	}, [isLoading, data, error]);

	// Brief "Saved" confirmation when a save request resolves without error.
	useEffect(() => {
		if (wasLoading.current && !isLoading && dataKey && !isError) {
			setSavedKey(dataKey);
			clearTimeout(savedTimer.current);
			savedTimer.current = setTimeout(() => setSavedKey(''), 2200);
		}
		wasLoading.current = isLoading;
	}, [isLoading, isError, dataKey]);

	useEffect(() => () => clearTimeout(savedTimer.current), []);

	return (
		<div className='bBlocksSettingPage'>
			<header className='bbSettingsHead'>
				<h2 className='bBlocksHeading'>API Integrations</h2>
				<p className='bbSettingsSub'>
					Connect bBlocks to external services to power features like AI content and social embeds.
					Your keys are stored in this site&rsquo;s database and are never shared with us.
				</p>
			</header>

			<div className='bBlocksApiCartContainer'>
				{apiKeyData.map((item) => {
					const value = apiData[item.name]?.key ?? '';
					const hasError = Boolean(error?.[item.name]);
					const isConnected = Boolean(data?.[item.name]?.key) && !hasError;
					const saving = isLoading && dataKey === item.name;
					const isRevealed = Boolean(revealed[item.name]);

					const statusClass = isConnected ? 'isConnected' : hasError ? 'isError' : 'isIdle';
					const statusLabel = isConnected ? 'Connected' : hasError ? 'Invalid' : 'Not connected';

					return (
						<section key={item.name} className={`bBlocksApiCart ${statusClass}`}>
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
										onChange={(e) => setApiData({ ...apiData, [item.name]: { key: e.target.value } })}
										onKeyDown={(e) => { if ('Enter' === e.key) handleApiData(item.name); }}
									/>

									{value && (
										<button
											type='button'
											className='bbReveal'
											aria-pressed={isRevealed}
											aria-label={isRevealed ? 'Hide key' : 'Show key'}
											onClick={() => toggleReveal(item.name)}
										>
											{isRevealed ? <EyeOffIcon /> : <EyeIcon />}
										</button>
									)}
								</div>
							</div>

							<div className='bBlocksApiFooter'>
								<p className='bbStatusLine'>
									{hasError ? (
										<span className='bbErr'>{error?.[item.name]?.message || 'Could not validate this key'}</span>
									) : savedKey === item.name ? (
										<span className='bbOk'>Saved</span>
									) : isConnected ? (
										<span className='bbOk'>Valid key saved</span>
									) : (
										<span className='bbMuted'>No key saved yet</span>
									)}
								</p>

								<Button
									className='bBlocksApiSaveBtn'
									type='button'
									disabled={saving}
									onClick={() => handleApiData(item.name)}
								>
									{saving ? 'Saving…' : 'Save'}
								</Button>
							</div>
						</section>
					);
				})}
			</div>
		</div>
	);
};

export default Settings;
